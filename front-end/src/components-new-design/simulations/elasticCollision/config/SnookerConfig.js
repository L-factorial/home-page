import Simulation from './../../../../simulation-logic/elastic-collision/Simulation';
import Particle from './../../../../simulation-logic/elastic-collision/Particle';


class SnookerConfig{
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;


        this.row = (canvas.width > 700) ? 6 : 4;
        this.radius = canvas.width/30;



        this.particlesArray = [];
        this.margin = canvas.width/50;

        this.topGap =this.margin/2;

        this.Hz = 1;
        this.simulator = this.init();
    }

    init() {
        let j = 0;
        let colors = ["red", "green", "blue", "yellow", "purple"];
        let colorIdx = 0;

        let ballGap = 10;
        let ballsWidth = (this.row*this.radius*2)+((this.row - 1)*ballGap);

        let rowStart = this.canvas.height - this.margin - this.topGap - this.radius;

        let sideGap = (  (this.canvas.width - this.margin*2) - ballsWidth  )/2;

        let colStart = this.margin + sideGap + this.radius;
        let col = this.row;
        let ballIdx = 'A';
        for(let i = 0; i < this.row; ++i) {
            let currCol = colStart;
            for(let j = 0; j < col; ++j) {
                this.particlesArray.push(new Particle(currCol, rowStart, 0, 0, this.radius/24, this.radius, ballIdx, colors[colorIdx], true));
                colorIdx = (colorIdx + 1)%colors.length;
                currCol =currCol + 2*this.radius + ballGap;
                ballIdx= String.fromCharCode(ballIdx.charCodeAt(0)+1);
                colorIdx = (colorIdx + 1)%colors.length;
            }
            colStart = colStart + this.radius + ballGap/2;
            rowStart = rowStart - this.radius*2 - ballGap;
            col = col - 1;
        }


        let cueBall1 = new Particle(this.particlesArray[this.particlesArray.length-1].rx, this.margin+this.radius+10, 0, 3, this.radius, 1.1*this.radius, this.particlesArray.length, "white", false);

        let cueBall2 = new Particle(this.margin+this.radius*2, this.margin+this.radius*10, 2.5, 1.5, this.radius, 1.1*this.radius, this.particlesArray.length, "white", false);

        let cueBall3 = new Particle(this.canvas.width - this.margin - this.radius*2, this.canvas.height - this.margin-this.radius*10, -3, -1, this.radius, 1.1*this.radius, this.particlesArray.length, "white", false);


        this.particlesArray.push(cueBall1);
        this.particlesArray.push(cueBall2);
        this.particlesArray.push(cueBall3);

        let simulator = new Simulation(this.ctx, this.particlesArray, this.canvas.width, this.canvas.height, this.margin, this.Hz, false);
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

export default SnookerConfig;