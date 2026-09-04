import { useEffect, useRef, useState } from 'react';
import { getKarmaFrame, LOOP_DURATION } from '../../../simulation-logic/karma-realization-bhakti/KarmaRealizationBhaktiSystem';
import KarmaRealizationBhaktiRenderer from './KarmaRealizationBhaktiRenderer';

export default function KarmaRealizationBhakti() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const rendererRef = useRef(null);
  const trailRef = useRef([]);
  const pointerRef = useRef(null);
  const pausedRef = useRef(false);
  const elapsedRef = useRef(0);
  const previousTimestampRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rendererRef.current = new KarmaRealizationBhaktiRenderer(canvas, context);

    const resize = () => {
      const bounds = wrapper.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (timestamp) => {
      if (previousTimestampRef.current === null) previousTimestampRef.current = timestamp;
      const delta = Math.min(50, timestamp - previousTimestampRef.current);
      previousTimestampRef.current = timestamp;
      if (!pausedRef.current) elapsedRef.current += delta;

      const frame = getKarmaFrame(elapsedRef.current, pointerRef.current, reducedMotion);
      const previous = trailRef.current[trailRef.current.length - 1];
      if (!previous || frame.progress >= previous.progress) {
        trailRef.current.push({ ...frame.particle, progress: frame.progress });
      } else {
        trailRef.current = [{ ...frame.particle, progress: frame.progress }];
      }
      if (trailRef.current.length > 150) trailRef.current.shift();
      rendererRef.current.render(frame, trailRef.current, elapsedRef.current);
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    if (reducedMotion) {
      elapsedRef.current = LOOP_DURATION * 0.68;
      const frame = getKarmaFrame(elapsedRef.current, null, true);
      rendererRef.current.render(frame, [frame.particle], elapsedRef.current);
    } else {
      animationRef.current = requestAnimationFrame(draw);
    }

    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion) {
        const frame = getKarmaFrame(elapsedRef.current, null, true);
        rendererRef.current.render(frame, [frame.particle], elapsedRef.current);
      }
    });
    observer.observe(wrapper);

    const handleVisibility = () => {
      previousTimestampRef.current = null;
      if (document.hidden) cancelAnimationFrame(animationRef.current);
      else if (!reducedMotion) animationRef.current = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const updatePointer = (event) => {
    const bounds = canvasRef.current.getBoundingClientRect();
    pointerRef.current = {
      x: (event.clientX - bounds.left) / bounds.width,
      y: 0.5 - (event.clientY - bounds.top) / bounds.height,
    };
  };

  const togglePaused = () => {
    pausedRef.current = !pausedRef.current;
    previousTimestampRef.current = null;
    setPaused(pausedRef.current);
  };

  return (
    <section
      className="karma-realization-bhakti"
      ref={wrapperRef}
      onPointerMove={updatePointer}
      onPointerLeave={() => { pointerRef.current = null; }}
      aria-label="Karma, realization, and bhakti visualized as a dynamical system"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="karma-system-equation" aria-hidden="true">
        y(t) = Σ Aₖe⁻ᵞᵏᵗ sin(ωₖt)
      </div>
      <button className="karma-animation-toggle" type="button" onClick={togglePaused} aria-pressed={paused}>
        {paused ? 'Resume motion' : 'Pause motion'}
      </button>
      <p className="sr-only">
        A particle begins as the superposition of five vibration modes. Higher frequencies dissipate
        until one tone remains, whose phase-space orbit spirals into equilibrium before the cycle begins again.
      </p>
    </section>
  );
}
