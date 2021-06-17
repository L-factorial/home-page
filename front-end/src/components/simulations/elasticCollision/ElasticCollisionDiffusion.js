import React from 'react'
import {useEffect, useRef} from 'react'
import DiffusionConfig from './config/DiffusionConfig';


function ElasticCollisionDiffusion() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        var parent = document.getElementById("canvadDivId");
        canvas.width  = parent.clientWidth;
        canvas.height = parent.clientHeight;

        let config = new DiffusionConfig(canvas, ctx);

        const simulate = () => {

            config.simulate();
            requestAnimationFrame(simulate);
        }
        simulate();

    }, [])

    return (
        <div>
        <canvas id="elastic-collision-canvas" ref={canvasRef}></canvas>
        </div>
    );
}

export default ElasticCollisionDiffusion
