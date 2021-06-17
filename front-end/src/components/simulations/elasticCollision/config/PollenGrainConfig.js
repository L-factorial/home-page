import Simulation from './../../../../simulation-logic/elastic-collision/Simulation';
import Particle from './../../../../simulation-logic/elastic-collision/Particle';


class PollenGrainConfig{
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;


        this.numberOfParticles = 200;
        this.particlesArray = [];
        this.margin = canvas.width/12;
        this.Hz = 1.75;

        this.velocityX = [1, 2, -1, 2, -2];
        this.velocityY = [-2, -1, 1, 2, -1];
        this.simulator = this.init();
    }

    init() {
        let radius = 3;
        let colors = ["red", "green", "blue", "yellow", "purple"];
        let colorIdx = 0;
        let k = 0;

        let pollen = new Particle(this.canvas.width/2, this.canvas.height/2, 0.2, 0.2, this.canvas.width/10, this.canvas.width/10, 0, 'red', false);
        this.particlesArray.push(pollen);

        let i = 1;

        console.log(radius);
  
        while (i <= this.numberOfParticles) {
            let minX = this.margin + radius;
            let maxX = this.canvas.width - this.margin - radius;
            let minY = this.margin + radius;
            let maxY = this.canvas.height - this.margin - radius;
    
            let x = Math.random() * (maxX - minX + 1) + minX;
            let y = Math.random() * (maxY - minY + 1) + minY;

            
            let shouldPlace = true;
            let currParticle = new Particle(x, y, this.velocityX[k], this.velocityY[k], radius, radius, i, colors[colorIdx], false);
            for(let j = 0; j < this.particlesArray.length; ++j) {
                if(currParticle.checkCollisionWith(this.particlesArray[j])) {
                    shouldPlace = false;
                }
            }
            if(!shouldPlace) {
                continue;
            }
            ++i;
            this.particlesArray.push(currParticle);
            colorIdx = (colorIdx + 1)%colors.length;
            k = (k + 1) % this.velocityY.length;
        }
        console.log(this.particlesArray);
        let simulator = new Simulation(this.ctx, this.particlesArray, this.canvas.width, this.canvas.height, this.margin, this.Hz, false);
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

export default PollenGrainConfig;