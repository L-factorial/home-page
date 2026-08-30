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

  const adjustControl = (name, amount, minimum, maximum, decimals = 0) => {
    const factor = 10 ** decimals;
    const value = Math.min(maximum, Math.max(minimum, controls[name] + amount));
    updateControls({ [name]: Math.round(value * factor) / factor });
  };

  return (
    <div className="magnus-effect" ref={wrapperRef}>
      <div className="magnus-animation-viewport" ref={viewportRef}>
        <canvas ref={canvasRef} aria-label="Interactive Magnus effect soccer ball animation" />
      </div>
      <div className={`magnus-controls floating-controls ${controlsOpen ? '' : 'collapsed'}`}>
        <button type="button" className="floating-controls-toggle" onClick={() => setControlsOpen((open) => !open)} aria-expanded={controlsOpen} aria-controls="magnus-controls-content" aria-label={`${controlsOpen ? 'Hide' : 'Show'} Magnus controls`}>
          <span>Magnus controls</span>
          <span className="floating-controls-action">{controlsOpen ? 'Hide' : 'Show controls'}</span>
          <span className="floating-controls-chevron" aria-hidden="true">{controlsOpen ? '−' : '+'}</span>
        </button>
        <div id="magnus-controls-content" className="floating-controls-content">
          <div className="magnus-control-strip">
            <div className="magnus-mode-toggle">
              <button className={controls.mode === 'trajectory' ? 'active' : ''} onClick={() => updateControls({ mode: 'trajectory' })}>Trajectory</button>
              <button className={controls.mode === 'airflow' ? 'active' : ''} onClick={() => updateControls({ mode: 'airflow' })}>Airflow</button>
            </div>
            <div className="magnus-stepper">
              <span>Spin <strong>{controls.spin.toFixed(1)}</strong></span>
              <button onClick={() => adjustControl('spin', -0.5, -15, 15, 1)} aria-label="Decrease spin">‹</button>
              <button onClick={() => adjustControl('spin', 0.5, -15, 15, 1)} aria-label="Increase spin">›</button>
            </div>
            <div className="magnus-stepper">
              <span>Speed <strong>{controls.speed}</strong></span>
              <button onClick={() => adjustControl('speed', -1, 10, 40)} aria-label="Decrease speed">‹</button>
              <button onClick={() => adjustControl('speed', 1, 10, 40)} aria-label="Increase speed">›</button>
            </div>
            <div className="magnus-stepper">
              <span>Strength <strong>{controls.magnusStrength.toFixed(2)}</strong></span>
              <button onClick={() => adjustControl('magnusStrength', -0.02, 0, 1.2, 2)} aria-label="Decrease Magnus strength">‹</button>
              <button onClick={() => adjustControl('magnusStrength', 0.02, 0, 1.2, 2)} aria-label="Increase Magnus strength">›</button>
            </div>
            <div className="magnus-actions">
              <button onClick={() => updateControls({ spin: -controls.spin })}>Reverse</button>
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
    </div>
  );
}
