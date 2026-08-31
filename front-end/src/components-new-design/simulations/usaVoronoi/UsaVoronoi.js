import { useEffect, useRef, useState } from 'react';
import capitals from '../../../data/usaCapitals';
import usaBoundary from '../../../data/usaBoundary';
import { projectBoundary, normalizeBoundary } from '../../../simulation-logic/fourier-curve/BoundaryProjection';
import { resampleByArcLength } from '../../../simulation-logic/fourier-curve/ArcLengthResampler';
import FourierSeries from '../../../simulation-logic/fourier-curve/FourierSeries';
import FourierAnimationIterator from '../../../simulation-logic/fourier-curve/FourierAnimationIterator';
import VoronoiSweepIterator from '../../../simulation-logic/voronoi/VoronoiSweepIterator';

const coordinates = usaBoundary.map(({ x, y }) => [x, y]);
const projected = projectBoundary(coordinates);
const sampled = resampleByArcLength(projected, 2048);
const centerX = sampled.reduce((sum, p) => sum + p.x, 0) / sampled.length;
const centerY = sampled.reduce((sum, p) => sum + p.y, 0) / sampled.length;
const scale = Math.max(...sampled.map((p) => Math.max(Math.abs(p.x - centerX), Math.abs(p.y - centerY))));
const outline = normalizeBoundary(sampled);
const meanLon = coordinates.reduce((sum, p) => sum + p[0], 0) / coordinates.length;
const meanLat = coordinates.reduce((sum, p) => sum + p[1], 0) / coordinates.length;
const lonScale = Math.cos(meanLat * Math.PI / 180);
const sites = capitals.map((capital) => ({ ...capital, x: ((capital.x - meanLon) * lonScale - centerX) / scale, y: (capital.y - meanLat - centerY) / scale }));
const bounds = { minX: -1.12, maxX: 1.12, minY: -1.12, maxY: 1.12 };

export default function UsaVoronoi() {
  const canvasRef = useRef(null); const wrapperRef = useRef(null);
  const [status, setStatus] = useState('Preparing capital sites');
  useEffect(() => {
    const canvas = canvasRef.current, wrapper = wrapperRef.current, ctx = canvas.getContext('2d');
    let sweep = new VoronoiSweepIterator(sites, bounds);
    let fourier = new FourierAnimationIterator(new FourierSeries(outline), 101);
    let timer, animationFrame, finalFrame, lastFourierTime = 0;
    let redraw = () => {};
    const resize = () => {
      canvas.width = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;
      redraw();
    };
    const toCanvas = ({ x, y }) => { const s = Math.min(canvas.width, canvas.height) * .43; return { x: canvas.width / 2 + x * s, y: canvas.height / 2 - y * s }; };
    const path = (points, close = true) => { if (!points.length) return; ctx.beginPath(); points.forEach((point, i) => { const p = toCanvas(point); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); if (close) ctx.closePath(); };
    const background = () => { ctx.clearRect(0,0,canvas.width,canvas.height); const g=ctx.createRadialGradient(canvas.width/2,canvas.height/2,0,canvas.width/2,canvas.height/2,canvas.width*.7);g.addColorStop(0,'#173629');g.addColorStop(1,'#06120d');ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height); };
    const drawCells = (frame, clipped = false, showDiscoveryLabel = false) => {
      background(); ctx.save(); if (clipped) { path(outline); ctx.clip(); }
      frame.cells.forEach((cell,i)=>{path(cell.polygon);ctx.fillStyle=`hsla(${(i*47)%360},60%,48%,.38)`;ctx.fill();ctx.strokeStyle='rgba(213,255,95,.55)';ctx.lineWidth=1;ctx.stroke();});ctx.restore();
      frame.activeSites.forEach(site=>{
        const p=toCanvas(site);
        ctx.beginPath();
        ctx.arc(p.x,p.y,3,0,Math.PI*2);
        ctx.fillStyle='#fff';
        ctx.fill();
      });
      if (showDiscoveryLabel && frame.activeSites.length) {
        const site = frame.activeSites[frame.activeSites.length - 1];
        const p = toCanvas(site);
        const labelSize = canvas.width < 560 ? 10 : 12;
        ctx.font = `600 ${labelSize}px sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(6,18,13,.9)';
        ctx.strokeText(site.name, p.x + 6, p.y - 6);
        ctx.fillStyle = '#fff';
        ctx.fillText(site.name, p.x + 6, p.y - 6);
      }
      frame.pendingSites.forEach(site=>{const p=toCanvas(site);ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.22)';ctx.fill();});
      if(!frame.complete){const x=toCanvas({x:frame.sweepX,y:0}).x;ctx.setLineDash([6,5]);ctx.strokeStyle='#fff';ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();ctx.setLineDash([]);}
    };
    const drawFourier = (frame) => {
      drawCells(finalFrame,false);
      frame.vectors.slice(0,180).forEach(v=>{const a=toCanvas(v),b=toCanvas({x:v.endX,y:v.endY}),r=v.radius*Math.min(canvas.width,canvas.height)*.43;if(r>1.2){ctx.beginPath();ctx.arc(a.x,a.y,r,0,Math.PI*2);ctx.strokeStyle='rgba(220,240,226,.15)';ctx.stroke();}ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='rgba(213,255,95,.55)';ctx.stroke();});
      if(frame.tracedPath.length>1){path(frame.tracedPath,false);ctx.strokeStyle='#d5ff5f';ctx.lineWidth=2.4;ctx.stroke();}
    };
    const drawFinished = () => {
      drawCells(finalFrame, true);
      path(outline);
      ctx.strokeStyle = '#d5ff5f';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    };
    const animateFourier = (timestamp) => {
      const frame = fourier.next(timestamp).value;
      if (frame.time < lastFourierTime) {
        redraw = drawFinished;
        redraw();
        setStatus('Finished · clipped to mainland USA');
        timer = setTimeout(restart, 2500);
        return;
      }
      lastFourierTime = frame.time;
      redraw = () => drawFourier(frame);
      redraw();
      setStatus(`Tracing USA boundary · ${Math.round(frame.time * 100)}%`);
      animationFrame = requestAnimationFrame(animateFourier);
    };
    const advance = () => {
      finalFrame = sweep.next();
      redraw = () => drawCells(finalFrame, false, true);
      redraw();
      setStatus(`Voronoi sweep · ${finalFrame.step} / ${finalFrame.totalSteps}`);
      if (sweep.hasNext()) timer = setTimeout(advance, 250);
      else timer = setTimeout(() => { animationFrame = requestAnimationFrame(animateFourier); }, 250);
    };
    const restart = () => {
      sweep = new VoronoiSweepIterator(sites, bounds);
      fourier = new FourierAnimationIterator(new FourierSeries(outline), 101);
      finalFrame = null;
      lastFourierTime = 0;
      setStatus('Preparing capital sites');
      advance();
    };
    resize();advance();const observer=new ResizeObserver(resize);observer.observe(wrapper);
    return()=>{clearTimeout(timer);cancelAnimationFrame(animationFrame);observer.disconnect();};
  },[]);
  return <div className="usa-voronoi" ref={wrapperRef}><canvas ref={canvasRef} aria-label="Voronoi sweep and Fourier outline of mainland USA"/><div className="usa-voronoi-status">{status}</div></div>;
}
