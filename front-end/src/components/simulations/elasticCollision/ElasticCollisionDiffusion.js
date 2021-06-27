import React from 'react'
import {useEffect, useRef} from 'react'
import DiffusionConfig from './config/DiffusionConfig';
import {isMobile} from "react-device-detect";


function ElasticCollisionDiffusion() {
    const canvasRef = useRef(null)
    const animationRef = useRef(null);

    const handleResize = () => {
        if(isMobile) {
            return;
        }
        if(animationRef != null) {
            cancelAnimationFrame(animationRef.current);
        }
        initAndAnimate();
    };

    const initAndAnimate = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        var parent = document.getElementById("canvadDivId");

        canvas.width  = parent.clientWidth;
        canvas.height = parent.clientHeight;
        let config = new DiffusionConfig(canvas, ctx);

        const simulate = () => {
            config.simulate();
            animationRef.current = requestAnimationFrame(simulate);
        }
        animationRef.current = requestAnimationFrame(simulate);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        initAndAnimate();
        return () => {
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(animationRef.current);
        }

    }, [])

    return (
        <div>
        <canvas id="elastic-collision-canvas" ref={canvasRef}></canvas>
        </div>
    );
}

export default ElasticCollisionDiffusion
