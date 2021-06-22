import Simulation from './../../../../simulation-logic/elastic-collision/Simulation';
import Particle from './../../../../simulation-logic/elastic-collision/Particle';
import EventDrivenSimulation from './../../../../simulation-logic/elastic-collision/EventDrivenSimulation';



class RandomConfig{
    constructor(canvas, ctx, withConvexHull){
        this.canvas = canvas;
        this.ctx = ctx;
        this.numberOfParticles = 100;
        this.particlesArray = [];
        this.margin = canvas.width/60;
        this.Hz = 1;
        this.velocityX = [1, 2, -1, 2, -2];
        this.velocityY = [-2, -1, 1, 2, -1];
        this.withConvexHull = withConvexHull;
        this.simulator = this.init();
    }

    init() {
        let j = 0;
        let colors = ["red", "green", "blue", "yellow", "purple"];
        let colorIdx = 0;
        let i = 0
        while (i < this.numberOfParticles) {
            let radius = (Math.random() * 15) + 3;

            let minX = this.margin + radius;
            let maxX = this.canvas.width - this.margin - radius;
            let minY = this.margin + radius;
            let maxY = this.canvas.height - this.margin - radius;
    
            let x = Math.random() * (maxX - minX + 1) + minX;
            let y = Math.random() * (maxY - minY + 1) + minY;
    
            let currParticle = new Particle(x, y, this.velocityX[j], this.velocityY[j], radius/12, radius, i, colors[colorIdx], false);
            let shouldPlace = true;
            for(let j = 0; j < this.particlesArray.length; ++j) {
                if(currParticle.checkCollisionWith(this.particlesArray[j])) {
                    shouldPlace = false;
                }
            }
            if(!shouldPlace) {
                continue;
            }

            // this.particlesArray.push(new Particle(x, y, this.velocityX[j], this.velocityY[j], radius/12, radius, i, colors[colorIdx], false));
            this.particlesArray.push(currParticle);

            j = (j + 1) % 5;
            colorIdx = (colorIdx + 1)%colors.length;
            ++i;
        }

        let simulator = new Simulation(this.ctx, this.particlesArray, this.canvas.width, this.canvas.height, this.margin, this.Hz, this.withConvexHull );
        // let simulator = new EventDrivenSimulation(this.ctx, this.particlesArray, this.canvas.width, this.canvas.height, this.margin, this.Hz, this.withConvexHull );
        
        simulator.initSimulation();
        return simulator;
    }

    simulate(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.beginPath();
        this.ctx.lineWidth = "6";
        this.ctx.strokeStyle = "red";
        this.ctx.rect(this.margin, this.margin, this.canvas.width-2*this.margin, this.canvas.height-2*this.margin);
        this.ctx.stroke();

        this.simulator.simulate(this.Hz)
    }
}

export default RandomConfig;