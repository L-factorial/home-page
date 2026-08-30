import { useEffect, useRef, useState } from 'react';
import MagnusEffectConfig from './config/MagnusEffectConfig';

const initialControls = {
  mode: 'trajectory',
  spin: 5,
  speed: 25,
  magnusStrength: 0.38,
  gravityEnabled: false,
  dragEnabled: false,
  paused: false,
};

export default function MagnusEffect() {
  const wrapperRef = useRef(null);
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const configRef = useRef(null);
  const animationRef = useRef(null);
  const [controls, setControls] = useState(initialControls);
  const [controlsOpen, setControlsOpen] = useState(true);

  useEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const resize = () => {
      canvas.width = Math.max(1, viewport.clientWidth);
      canvas.height = Math.max(1, viewport.clientHeight);
    };

    resize();
    configRef.current = new MagnusEffectConfig(canvas, context, controls);
    const animate = (timestamp) => {
      configRef.current.renderNextFrame(timestamp);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(viewport);
    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
    // Configuration is updated directly without recreating the animation loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateControls = (changes) => {
    setControls((current) => {
      const next = { ...current, ...changes };
      configRef.current?.updateControls(next);
      return next;
    });
  };

  const togglePaused = () => {
    const paused = !controls.paused;
    setControls((current) => ({ ...current, paused }));
    configRef.current?.setPaused(paused);
  };

  return (
    <div className="magnus-effect" ref={wrapperRef}>
      <div className="magnus-animation-viewport" ref={viewportRef}>
        <canvas ref={canvasRef} aria-label="Interactive Magnus effect soccer ball animation" />
      </div>
      <div className={`magnus-controls floating-controls ${controlsOpen ? '' : 'collapsed'}`}>
        <button type="button" className="floating-controls-toggle" onClick={() => setControlsOpen((open) => !open)} aria-expanded={controlsOpen} aria-controls="magnus-controls-content">
          <span>Animation controls</span>
          <span className="floating-controls-chevron" aria-hidden="true">⌃</span>
        </button>
        <div id="magnus-controls-content" className="floating-controls-content">
        <div className="magnus-mode-toggle">
          <button className={controls.mode === 'trajectory' ? 'active' : ''} onClick={() => updateControls({ mode: 'trajectory' })}>Trajectory</button>
          <button className={controls.mode === 'airflow' ? 'active' : ''} onClick={() => updateControls({ mode: 'airflow' })}>Airflow</button>
        </div>

        <label>
          <span>Spin <strong>{controls.spin.toFixed(1)} rev/s</strong></span>
          <input type="range" min="-15" max="15" step="0.5" value={controls.spin} onChange={(event) => updateControls({ spin: Number(event.target.value) })} />
        </label>
        <label>
          <span>Speed <strong>{controls.speed} m/s</strong></span>
          <input type="range" min="10" max="40" step="1" value={controls.speed} onChange={(event) => updateControls({ speed: Number(event.target.value) })} />
        </label>
        <label>
          <span>Magnus strength <strong>{controls.magnusStrength.toFixed(2)}</strong></span>
          <input type="range" min="0" max="1.2" step="0.02" value={controls.magnusStrength} onChange={(event) => updateControls({ magnusStrength: Number(event.target.value) })} />
        </label>

        <div className="magnus-actions">
          <button onClick={() => updateControls({ spin: -controls.spin })}>Reverse spin</button>
          <button onClick={togglePaused}>{controls.paused ? 'Play' : 'Pause'}</button>
          <button onClick={() => configRef.current?.restart()}>Reset</button>
        </div>
        <div className="magnus-options">
          <label><input type="checkbox" checked={controls.gravityEnabled} onChange={(event) => updateControls({ gravityEnabled: event.target.checked })} /> Gravity</label>
          <label><input type="checkbox" checked={controls.dragEnabled} onChange={(event) => updateControls({ dragEnabled: event.target.checked })} /> Drag</label>
        </div>
        </div>
      </div>
    </div>
  );
}
