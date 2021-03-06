import Point from '../convex-hull/Point';
import ConvexHull from '../convex-hull/ConvexHull';

class Simulation {
    constructor(ctx, particles, width, height, margin, Hz, withConvexHull) {
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
        this.Hz = Hz;
        this.lastHitParticleMatrix = [];

        this.lastHitVerticalWall=[];
        this.lastHitHorizontalWall=[];

        this.withConvexHull =  withConvexHull;
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
            let row = [];
            for(let j = 0; j < this.particles.length; ++j) {
                row.push(-1);
            }
            this.lastHitParticleMatrix.push(row);
            this.lastHitHorizontalWall.push(-1);
            this.lastHitVerticalWall.push(-1);
        }

        for(let i = 0; i < this.particles.length; ++i) {
            this.addParticleInGrid(i);
        }
        console.table(this.grid);
    }


    hasRecentlyCollidedWithVerticalWall(i) {
        if(this.lastHitVerticalWall[i] == -1) {
            return false;
        }
        if(this.time - this.lastHitVerticalWall[i] > 3*this.Hz) {
            return false;
        }
        return true;
    }

    hasRecentlyCollidedWithHorizontalWall(i) {
        if(this.lastHitHorizontalWall[i] == -1) {
            return false;
        }
        if(this.time - this.lastHitHorizontalWall[i] > 3*this.Hz) {
            return false;
        }
        return true;
    }
    wallBounce(i, currBouncedParticles) {
        if(currBouncedParticles.has(i)){
            return;
        }
        let x = this.particles[i].rx;
        let y = this.particles[i].ry;
        let r =this.particles[i].radius;

        if( (x <= (this.margin + r) || (x + r ) >= this.width - this.margin)    && !this.hasRecentlyCollidedWithVerticalWall(i)) {
            this.particles[i].bounceOffVerticalWall();
            currBouncedParticles.add(i);

            this.lastHitVerticalWall[i] = this.time;
        }
        if( (y <= (this.margin +r) || (y +r) >= this.height - this.margin) && !this.hasRecentlyCollidedWithHorizontalWall(i) ) {
            this.particles[i].bounceOffHorizontalWall();
            currBouncedParticles.add(i);

            this.lastHitHorizontalWall[i] = this.time;
        }
    }

    haveRecentlyCollided(i, j) {
        if(this.lastHitParticleMatrix[i][j] == -1) {
            return false;
        }
        if(this.time - this.lastHitParticleMatrix[i][j] > 3*this.Hz) {
            return false;
        }
        return true;
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
                    if(this.particles[k].checkCollisionWith(this.particles[l])  && !this.haveRecentlyCollided(k, l)){
                        this.particles[k].bounceOff1(this.particles[l]);
                        currBouncedParticles.add(k);
                        currBouncedParticles.add(l);
                        this.lastHitParticleMatrix[k][l] = this.time;
                        this.lastHitParticleMatrix[l][k] = this.time;
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
            if(this.withConvexHull) {
                points.push(new Point(this.particles[i].rx, this.particles[i].ry));
            }
        }
        if(this.withConvexHull) {
            let convexHull = new ConvexHull(points);
            convexHull.draw(this.ctx, this.height);
        }

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