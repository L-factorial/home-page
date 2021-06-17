import React from 'react'
import {useEffect, useRef} from 'react'
import Simulation from '../../../simulation-logic/elastic-collision/Simulation';
import Particle from '../../../simulation-logic/elastic-collision/Particle';
import RandomConfig from './config/RandomConfig';
import SnookerConfig from './config/SnookerConfig';


function ElasticCollisionSnookerBoard() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        var parent = document.getElementById("canvadDivId");
        canvas.width  = parent.clientWidth;
        canvas.height = parent.clientHeight;

        //let config = new RandomConfig(canvas, ctx);
        let config = new SnookerConfig(canvas, ctx);

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

export default ElasticCollisionSnookerBoard
