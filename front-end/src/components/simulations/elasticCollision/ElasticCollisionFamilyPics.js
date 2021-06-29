import React from 'react'
import { useEffect, useRef } from 'react'
import FamilyImagesConfig from './config/FamilyImagesConfig';
import {isMobile} from "react-device-detect";


function ElasticCollisionFamilyPics() {
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

        let config = new FamilyImagesConfig(canvas, ctx);

        const simulate = () => {
            config.simulate();
            animationRef.current = requestAnimationFrame(simulate);
        }
        animationRef.current = requestAnimationFrame(simulate);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        const burger = document.getElementsByClassName('burger')[0];
        burger.addEventListener('click', handleResize);
        initAndAnimate();
        return () => {
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(animationRef.current);
            burger.removeEventListener('click', handleResize);

        }

    }, [])

    return (
        <div>
            <canvas id="elastic-collision-canvas-family" ref={canvasRef}></canvas>
        </div>
    );
}

export default ElasticCollisionFamilyPics;
