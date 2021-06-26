import Simulation from './../../../../simulation-logic/elastic-collision/Simulation';
import Particle from './../../../../simulation-logic/elastic-collision/Particle';

import momImg from './img/mom.JPG';
import dadImg from './img/dad.JPG';
import vivImg from './img/viv.JPG';
import rayImg from './img/ray.JPG';



class FamilyImagesConfig{
    constructor(canvas, ctx, withConvexHull){
        this.canvas = canvas;
        this.ctx = ctx;
        this.numberOfParticles = 4;
        this.particlesArray = [];
        this.margin = canvas.width/60;
        this.Hz = 1;
        this.velocityX = [1, 2, -1, 2, -2];
        this.velocityY = [-2, -1, 1, 2, -1];
        this.withConvexHull = withConvexHull;
        this.images = []
        this.initImages();
        this.simulator = this.init();
    }

    initImages() {
        var mom = new Image();
        mom.src = momImg;
        var dad = new Image();
        dad.src = dadImg;
        var viv = new Image();
        viv.src = vivImg;
        var ray = new Image();
        ray.src = rayImg;
        this.images.push(mom);
        this.images.push(dad);
        this.images.push(viv);
        this.images.push(ray);
    }

    init() {
        let j = 0;
        let colors = ["red", "green", "blue", "yellow", "purple"];
        let colorIdx = 0;
        let i = 0

        let imgIdx = 0;

        while (i < this.numberOfParticles) {
            let radius = this.canvas.width/12;

            let minX = this.margin + radius;
            let maxX = this.canvas.width - this.margin - radius;
            let minY = this.margin + radius;
            let maxY = this.canvas.height - this.margin - radius;
    
            let x = Math.random() * (maxX - minX + 1) + minX;
            let y = Math.random() * (maxY - minY + 1) + minY;
    
            let currParticle = new Particle(x, y, this.velocityX[j], this.velocityY[j], radius/2, radius, i, colors[colorIdx], false, this.images[imgIdx]);
            let shouldPlace = true;
            for(let j = 0; j < this.particlesArray.length; ++j) {
                if(currParticle.checkCollisionWith(this.particlesArray[j])) {
                    shouldPlace = false;
                }
            }
            if(!shouldPlace) {
                continue;
            }
            if(imgIdx == 1) {
                currParticle.mass = currParticle.mass/8;
            }
            this.particlesArray.push(currParticle);

            j = (j + 1) % 5;
            imgIdx = (imgIdx + 1) % this.images.length;
            colorIdx = (colorIdx + 1)%colors.length;
            ++i;
        }

        let simulator = new Simulation(this.ctx, this.particlesArray, this.canvas.width, 
            this.canvas.height, this.margin, this.Hz, this.withConvexHull);
        
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

export default FamilyImagesConfig;