import Simulation from './../../../../simulation-logic/elastic-collision/Simulation';
import Particle from './../../../../simulation-logic/elastic-collision/Particle';


class SnookerConfig{
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;


        this.row = 6;
        this.radius = canvas.width/60;



        this.particlesArray = [];
        this.margin = canvas.width/12;

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
        let ballIdx = 0;
        for(let i = 0; i < this.row; ++i) {
            let currCol = colStart;
            for(let j = 0; j < col; ++j) {
                this.particlesArray.push(new Particle(currCol, rowStart, 0, 0, this.radius/24, this.radius, ballIdx, colors[colorIdx], true));
                colorIdx = (colorIdx + 1)%colors.length;
                currCol =currCol + 2*this.radius + ballGap;
                ballIdx= ballIdx+1;
                colorIdx = (colorIdx + 1)%colors.length;
            }
            colStart = colStart + this.radius + ballGap/2;
            rowStart = rowStart - this.radius*2 - ballGap;
            col = col - 1;
        }


        let cueBall = new Particle(this.particlesArray[this.particlesArray.length-1].rx, this.margin+this.radius+10, 2.5, 3, this.radius, this.radius, this.particlesArray.length, "red", false);
        this.particlesArray.push(cueBall);
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

export default SnookerConfig;