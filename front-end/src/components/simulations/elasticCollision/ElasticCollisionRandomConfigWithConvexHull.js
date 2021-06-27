import React from 'react'
import {useEffect, useRef} from 'react'
import RandomConfig from './config/RandomConfig';


function ElasticCollisionRandomConfigWithConvexHull() {
    const canvasRef = useRef(null)
    const animationRef = useRef(null);

    const handleResize = () => {
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
        window.addEventListener('resize', handleResize);
        initAndAnimate();
        return () => {
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(animationRef.current);
        }

    }, [])
    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext("2d");
    //     var parent = document.getElementById("canvadDivId");
    //     canvas.width  = parent.clientWidth;
    //     canvas.height = parent.clientHeight;

    //     let config = new RandomConfig(canvas, ctx, true);

    //     const simulate = () => {

    //         config.simulate();
    //         requestAnimationFrame(simulate);
    //     }
    //     simulate();

    // }, [])

    return (
        <div>
        <canvas id="elastic-collision-canvas" ref={canvasRef}></canvas>
        </div>
    );
}

export default ElasticCollisionRandomConfigWithConvexHull
