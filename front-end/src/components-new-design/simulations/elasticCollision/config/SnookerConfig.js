import Simulation from './../../../../simulation-logic/elastic-collision/Simulation';
import SnookerBallParticle from './SnookerBallParticle';
import drawSnookerTable from './drawSnookerTable';

const SNOOKER_COLORS = [
    { base: '#d5202f', highlight: '#ff6975', shadow: '#8e0713', edge: '#4a0309' },
    { base: '#f3c51c', highlight: '#fff18a', shadow: '#a06f00', edge: '#543900' },
    { base: '#168348', highlight: '#75d69a', shadow: '#07502a', edge: '#032d17' },
    { base: '#7a3f22', highlight: '#c98761', shadow: '#47200f', edge: '#251006' },
    { base: '#2168bb', highlight: '#74b9ff', shadow: '#0d3976', edge: '#061d40' },
    { base: '#e55b9b', highlight: '#ffabd1', shadow: '#92305e', edge: '#4e1730' },
    { base: '#191c1d', highlight: '#7d8587', shadow: '#090a0b', edge: '#020303' },
];

const CUE_BALL_COLOR = {
    base: '#f4f1df',
    highlight: '#ffffff',
    shadow: '#aaa995',
    edge: '#68695d',
};


class SnookerConfig{
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;


        this.row = 5;
        this.radius = Math.max(7, Math.min(16, Math.min(canvas.width, canvas.height) / 34));

        this.particlesArray = [];
        this.margin = Math.max(28, Math.min(canvas.width, canvas.height) * 0.075);
        const pocketRadius = this.radius * 1.72;
        this.pockets = [
            { x: this.margin, y: this.margin, radius: pocketRadius },
            { x: this.canvas.width / 2, y: this.margin, radius: pocketRadius },
            { x: this.canvas.width - this.margin, y: this.margin, radius: pocketRadius },
            { x: this.margin, y: this.canvas.height - this.margin, radius: pocketRadius },
            { x: this.canvas.width / 2, y: this.canvas.height - this.margin, radius: pocketRadius },
            { x: this.canvas.width - this.margin, y: this.canvas.height - this.margin, radius: pocketRadius },
        ];

        this.topGap =this.margin/2;

        this.Hz = 1;
        this.simulator = this.init();
    }

    init() {
        let colorIdx = 0;

        let ballGap = Math.max(2, this.radius * 0.24);
        const spacing = this.radius * 2 + ballGap;
        const playableWidth = this.canvas.width - this.margin * 2;
        const playableHeight = this.canvas.height - this.margin * 2;
        const landscape = playableWidth >= playableHeight;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const rackAxisStart = landscape
            ? this.margin + playableWidth * 0.6
            : this.margin + playableHeight * 0.6;
        let ballIdx = 1;
        for(let row = 0; row < this.row; ++row) {
            const ballsInRow = row + 1;
            const crossAxisStart = (landscape ? centerY : centerX) - (ballsInRow - 1) * spacing / 2;
            for(let index = 0; index < ballsInRow; ++index) {
                const axis = rackAxisStart + row * spacing;
                const crossAxis = crossAxisStart + index * spacing;
                const x = landscape ? axis : crossAxis;
                const y = landscape ? crossAxis : axis;
                this.particlesArray.push(new SnookerBallParticle(x, y, 0, 0, this.radius/24, this.radius, ballIdx, SNOOKER_COLORS[colorIdx], true));
                colorIdx = (colorIdx + 1)%SNOOKER_COLORS.length;
                ballIdx += 1;
            }
        }

        // The cue ball approaches the apex along the long table axis.
        const cueAxis = landscape
            ? this.margin + playableWidth * 0.2
            : this.margin + playableHeight * 0.2;
        const cueBall = new SnookerBallParticle(
            landscape ? cueAxis : centerX,
            landscape ? centerY : cueAxis,
            landscape ? 3.2 : 0,
            landscape ? 0 : 3.2,
            this.radius,
            1.1*this.radius,
            this.particlesArray.length,
            CUE_BALL_COLOR,
            false
        );

        this.particlesArray.push(cueBall);

        let simulator = new Simulation(this.ctx, this.particlesArray, this.canvas.width, this.canvas.height, this.margin, this.Hz, false);
        simulator.initSimulation();
        return simulator;
    }

    updatePockets() {
        this.particlesArray.forEach((particle) => {
            if (particle.potted) {
                particle.potProgress = Math.min(1, particle.potProgress + 0.055);
                return;
            }

            const pocket = this.pockets.find((candidate) => {
                const dx = particle.rx - candidate.x;
                const dy = particle.ry - candidate.y;
                return Math.sqrt(dx * dx + dy * dy) <= candidate.radius;
            });

            if (pocket) {
                particle.potted = true;
                particle.pocket = pocket;
                particle.potStart = { x: particle.rx, y: particle.ry };
                particle.potProgress = 0;
                particle.vx = 0;
                particle.vy = 0;
            }
        });
    }

    simulate(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updatePockets();
        drawSnookerTable(this.ctx, this.canvas, this.margin, this.pockets);
        this.simulator.simulate(this.Hz)
    }
}

export default SnookerConfig;
