import { useEffect, useRef, useState } from 'react';

export default function WaveformView({ waveform, duration, currentTime }) {
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ width: 1, height: 1, pixelRatio: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      setSize({ width: bounds.width, height: bounds.height, pixelRatio });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height, pixelRatio } = size;
    const middle = height / 2;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const drawWave = (color, clipWidth = width) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, clipWidth, height);
      ctx.clip();
      ctx.beginPath();
      for (let index = 0; index < waveform.minimum.length; index += 1) {
        const x = index / (waveform.minimum.length - 1) * width;
        ctx.moveTo(x, middle - waveform.maximum[index] * height * 0.42);
        ctx.lineTo(x, middle - waveform.minimum[index] * height * 0.42);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0c1c14';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(224, 239, 229, 0.09)';
    ctx.beginPath();
    ctx.moveTo(0, middle);
    ctx.lineTo(width, middle);
    ctx.stroke();

    const progress = duration ? currentTime / duration : 0;
    drawWave('rgba(177, 202, 185, 0.38)');
    drawWave('#d5ff5f', width * progress);

    const playheadX = width * progress;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#d5ff5f';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [waveform, duration, currentTime, size]);

  return <canvas ref={canvasRef} className="fourier-audio-waveform" aria-label="Time-domain waveform with playback position" />;
}
