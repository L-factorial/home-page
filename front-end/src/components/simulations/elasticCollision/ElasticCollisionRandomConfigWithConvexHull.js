import React from 'react'
import {useEffect, useRef} from 'react'
import RandomConfig from './config/RandomConfig';


function ElasticCollisionRandomConfigWithConvexHull() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        var parent = document.getElementById("canvadDivId");
        canvas.width  = parent.clientWidth;
        canvas.height = parent.clientHeight;

        let config = new RandomConfig(canvas, ctx, true);

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

export default ElasticCollisionRandomConfigWithConvexHull
