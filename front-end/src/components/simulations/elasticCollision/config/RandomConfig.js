import Simulation from './../../../../simulation-logic/elastic-collision/Simulation';
import Particle from './../../../../simulation-logic/elastic-collision/Particle';


class RandomConfig{
    constructor(canvas, ctx, withConvexHull){
        this.canvas = canvas;
        this.ctx = ctx;


        this.numberOfParticles = 20;
        this.particlesArray = [];
        this.margin = canvas.width/12;
        this.Hz = 1.75;

        this.velocityX = [1, 2, -1, 2, -2];
        this.velocityY = [-2, -1, 1, 2, -1];
        this.withConvexHull = withConvexHull;
        this.simulator = this.init();
    }

    init() {
        let j = 0;
        let colors = ["red", "green", "blue", "yellow", "purple"];
        let colorIdx = 0;
        for (let i = 0; i < this.numberOfParticles; i++) {
            let radius = (Math.random() * 15) + 3;
            let minX = 100
            let maxX = this.canvas.width - minX;
            let minY = 100;
            let maxY = this.canvas.height - minY;
    
            let x = Math.random() * (maxX - minX + 1) + minX;
            let y = Math.random() * (maxY - minY + 1) + minY;
    
            this.particlesArray.push(new Particle(x, y, this.velocityX[j], this.velocityY[j], radius/12, radius, i, colors[colorIdx], false));
            j = (j + 1) % 5;
            colorIdx = (colorIdx + 1)%colors.length;
        }

        let simulator = new Simulation(this.ctx, this.particlesArray, this.canvas.width, this.canvas.height, this.margin, this.Hz, this.withConvexHull );
        simulator.initSimulation();
        return simulator;
    }

    simulate(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.beginPath();
        this.ctx.lineWidth = "2";
        this.ctx.strokeStyle = "red";
        this.ctx.rect(this.margin, this.margin, this.canvas.width-2*this.margin, this.canvas.height-2*this.margin);
        this.ctx.stroke();

        this.simulator.simulate(this.Hz)
    }
}

export default RandomConfig;