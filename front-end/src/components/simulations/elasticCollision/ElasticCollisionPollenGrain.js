import React from 'react'
import {useEffect, useRef} from 'react'
import Simulation from '../../../simulation-logic/elastic-collision/Simulation';
import Particle from '../../../simulation-logic/elastic-collision/Particle';
import RandomConfig from './config/RandomConfig';
import PollenGrainConfig from './config/PollenGrainConfig'


function ElasticCollisionPollenGrain() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        var parent = document.getElementById("canvadDivId");
        canvas.width  = parent.clientWidth;
        canvas.height = parent.clientHeight;

        let config = new PollenGrainConfig(canvas, ctx);

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

export default ElasticCollisionPollenGrain
