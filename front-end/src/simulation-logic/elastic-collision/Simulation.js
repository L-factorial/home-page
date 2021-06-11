import Point from '../convex-hull/Point';
import ConvexHull from '../convex-hull/ConvexHull';
import Particle from './Particle';

class Simulation {
    constructor(ctx, particles, width, height, margin) {
        this.ctx = ctx;
        this.time = 0.0;
        this.particles = particles;
        this.width = width;
        this.height = height;
        this.grid = [];
        this.cellWidth = 0;
        this.gridR = 0;
        this.gridC = 0;
        this.margin = margin;
    }

    addParticleInGrid(i) {
        let x = this.particles[i].rx;
        let y = this.particles[i].ry;
        let r = Math.floor(x/this.cellWidth);
        let c = Math.floor(y/this.cellWidth);
        if(r < 0) {
            r = 0;
        }
        if(r >= this.gridR) {
            r = this.gridR - 1;
        }
        if(c < 0) {
            c = 0;
        }
        if(c >= this.gridC) {
            c = this.gridC - 1;
        }
        this.grid[r][c].add(i);
    }

    removeParticleInGrid(i) {
        let x = this.particles[i].rx;
        let y = this.particles[i].ry;
        var r = Math.floor(x/this.cellWidth);
        var c = Math.floor(y/this.cellWidth);
        if(r < 0) {
            r = 0;
        }
        if(r >= this.gridR) {
            r= this.gridR - 1;
        }
        if(c < 0) {
            c = 0;
        }
        if(c >= this.gridC) {
            c = this.gridC - 1;
        }
        this.grid[r][c].delete(i);
    }

    initSimulation() {
        let width = 100;
        for(let p in this.particles){
            if(p.radius > width) {
                width = p.radius;
            }
        }
        this.cellWidth = 2*width;

        this.gridR = Math.ceil(this.height / width);
        this.gridC = Math.ceil(this.width / width);
        for(let r =0; r < this.gridR; r++) {
            this.grid.push([]);
            for(let c = 0; c < this.gridC; c++) {
                this.grid[r].push(new Set());
            }
        }

        for(let i = 0; i < this.particles.length; ++i) {
            this.addParticleInGrid(i);
        }
        console.table(this.grid);
    }

    wallBounce(i, currBouncedParticles) {
        if(currBouncedParticles.has(i)){
            return;
        }
        let x = this.particles[i].rx;
        let y = this.particles[i].ry;

        if(x <= this.margin || x >= this.width - this.margin) {
            this.particles[i].bounceOffVerticalWall();

            currBouncedParticles.add(i);
        }
        if(y <= this.margin || y >= this.height - this.margin) {
            this.particles[i].bounceOffHorizontalWall();
            currBouncedParticles.add(i);
        }
    }

    particleBounce(k, currBouncedParticles) {
        if(currBouncedParticles.has(k)){
            return;
        }
        let x = this.particles[k].rx;
        let y = this.particles[k].ry;
        let r = Math.floor(x/this.cellWidth);
        let c = Math.floor(y/this.cellWidth);

        for(let i = Math.max(0, r-1); i <= Math.min(r+1, this.gridR -1); ++i) {
            for(let j = Math.max(0, c-1); j <= Math.min(c+1, this.gridC-1); ++j) {
                for(let l of this.grid[i][j]) {
                    if( l == k || currBouncedParticles.has(k)) {
                        continue;
                    }
                    if(this.particles[k].checkCollisionWith(this.particles[l])){
                        this.particles[k].bounceOff(this.particles[l]);
                        currBouncedParticles.add(k);
                        currBouncedParticles.add(l);
                        return;
                    }
                }
            }
        }
    }

    bounceParticleIfNeeded(i, currBouncedParticles) {
        this.wallBounce(i, currBouncedParticles);
        this.particleBounce(i, currBouncedParticles);
    }

    simulate(Hz) { 
        //Draw all the particle first of all
        let points = [];
        for (let i = 0; i < this.particles.length; ++i) {
            this.particles[i].draw(this.ctx, this.height);
            points.push(new Point(this.particles[i].rx, this.particles[i].ry));

        }

        // console.log("Sorted points");
        // console.table(points);
        let convexHull = new ConvexHull(points);
        convexHull.draw(this.ctx, this.height);
        let currBouncedParticles = new Set();

        //Move all the particles to be redrawn in the next frame
        for (let i = 0; i < this.particles.length; ++i) {
            this.bounceParticleIfNeeded(i, currBouncedParticles)
            
            this.removeParticleInGrid(i);
            this.particles[i].move(Hz);
            this.addParticleInGrid(i);
        }

        this.time = this.time + Hz;

    }

}

export default Simulation;