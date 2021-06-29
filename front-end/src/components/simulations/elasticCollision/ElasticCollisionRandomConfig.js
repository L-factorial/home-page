import React from 'react'
import {useEffect, useRef} from 'react'
import RandomConfig from './config/RandomConfig';
import {isMobile} from "react-device-detect";


function ElasticCollisionRandomConfig() {
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

        let config = new RandomConfig(canvas, ctx);

        const simulate = () => {
            config.simulate();
            animationRef.current = requestAnimationFrame(simulate);
        }
        animationRef.current = requestAnimationFrame(simulate);
    }

    useEffect(() => {
        const burger = document.getElementsByClassName('burger')[0];
        burger.addEventListener('click', handleResize);
        window.addEventListener('resize', handleResize);
        initAndAnimate();
        return () => {
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(animationRef.current);
            burger.removeEventListener('click', handleResize);
        }

    }, [])

    return (
        <div>
        <canvas id="elastic-collision-canvas-random" ref={canvasRef}></canvas>
        </div>
    );
}

export default ElasticCollisionRandomConfig
