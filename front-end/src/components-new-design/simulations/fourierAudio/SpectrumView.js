import { useEffect, useRef } from 'react';

export default function SpectrumView({ spectrum, selectedFrequency, onSelect }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      const ctx = canvas.getContext('2d');
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const width = bounds.width;
      const height = bounds.height;
      const graphBottom = height - 24;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0c1c14';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(226, 241, 231, 0.08)';
      ctx.fillStyle = 'rgba(226, 241, 231, 0.48)';
      ctx.font = '10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      for (let frequency = 0; frequency <= spectrum.maxFrequency; frequency += 2000) {
        const x = frequency / spectrum.maxFrequency * width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, graphBottom);
        ctx.stroke();
        ctx.fillText(frequency === 0 ? '0' : `${frequency / 1000}k`, x, height - 7);
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, graphBottom);
      gradient.addColorStop(0, '#8ed7ff');
      gradient.addColorStop(1, 'rgba(213, 255, 95, 0.22)');
      ctx.beginPath();
      ctx.moveTo(0, graphBottom);
      spectrum.magnitudes.forEach((magnitude, index) => {
        const x = index / (spectrum.magnitudes.length - 1) * width;
        const y = graphBottom - magnitude * (graphBottom - 8);
        ctx.lineTo(x, y);
      });
      ctx.lineTo(width, graphBottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#9fdcff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (selectedFrequency !== null) {
        const x = selectedFrequency / spectrum.maxFrequency * width;
        ctx.fillStyle = 'rgba(255, 174, 143, 0.16)';
        ctx.fillRect(x - 5, 0, 10, graphBottom);
        ctx.strokeStyle = '#ffae8f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, graphBottom);
        ctx.stroke();
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [spectrum, selectedFrequency]);

  const selectFrequency = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
    onSelect(Math.round(x / bounds.width * spectrum.maxFrequency));
  };

  return (
    <canvas
      ref={canvasRef}
      className="fourier-audio-spectrum"
      aria-label="Clickable FFT frequency spectrum from zero to ten kilohertz"
      onPointerDown={selectFrequency}
    />
  );
}

