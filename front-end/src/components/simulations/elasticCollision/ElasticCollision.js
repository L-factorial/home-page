import React from 'react'
import {useEffect, useRef} from 'react'
import Simulation from '../../../simulation-logic/elastic-collision/Simulation';
import Particle from '../../../simulation-logic/elastic-collision/Particle';


function ElasticCollision() {
    const canvasRef = useRef(null)

    let numberOfParticles = 20;
    const particlesArray = [];
    let margin = 75;
    let Hz = 1.75;


    function init(canvas){
        const velocityX = [1, 2, -1, 2, -2];
        const velocityY = [-2, -1, 1, 2, -1];
        let j = 0;
        for (let i = 0; i < numberOfParticles; i++) {
            let radius = (Math.random() * 15) + 3;
            let minX = 100
            let maxX = canvas.width - minX;
            let minY = 100;
            let maxY = canvas.height - minY;
    
            let x = Math.random() * (maxX - minX + 1) + minX;
            let y = Math.random() * (maxY - minY + 1) + minY;
    
            particlesArray.push(new Particle(x, y, velocityX[j], velocityY[j], radius/12, radius, i));
            j = (j + 1) % 5;
        }
    }



    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // var elmnt = document.getElementById("myDIV");
        // canvas.width = elmnt.clientWidth;
        // canvas.height = elmnt.clientHeight
        canvas.width = 700;
        canvas.height = 800;
        init(canvas);
        let simulator = new Simulation(ctx, particlesArray, canvas.width, canvas.height, margin);
        const simulate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            simulator.simulate(Hz)
            requestAnimationFrame(simulate);
        }
        simulator.initSimulation();
        simulate();

    }, [])

    return (
        <div>
        <canvas id="elastic-collision-canvas" ref={canvasRef}></canvas>
        </div>
    );
}

export default ElasticCollision
