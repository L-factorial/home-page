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
        if (this.particles[i].potted) return;
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

    rebuildGrid() {
        for (const row of this.grid) {
            for (const cell of row) cell.clear();
        }
        for (let i = 0; i < this.particles.length; ++i) {
            if (!this.particles[i].potted) this.addParticleInGrid(i);
        }
    }

    initSimulation() {
        const maxRadius = Math.max(...this.particles.map((particle) => particle.radius), 1);
        this.cellWidth = 2 * maxRadius;

        // The first grid index is derived from x, the second from y.
        this.gridR = Math.ceil(this.width / this.cellWidth);
        this.gridC = Math.ceil(this.height / this.cellWidth);
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
    wallBounce(i) {
        const particle = this.particles[i];
        if (particle.potted) return;
        const minX = this.margin + particle.radius;
        const maxX = this.width - this.margin - particle.radius;
        const minY = this.margin + particle.radius;
        const maxY = this.height - this.margin - particle.radius;

        if (particle.rx < minX) {
            particle.rx = minX;
            if (particle.vx < 0) particle.bounceOffVerticalWall();
        } else if (particle.rx > maxX) {
            particle.rx = maxX;
            if (particle.vx > 0) particle.bounceOffVerticalWall();
        }

        if (particle.ry < minY) {
            particle.ry = minY;
            if (particle.vy < 0) particle.bounceOffHorizontalWall();
        } else if (particle.ry > maxY) {
            particle.ry = maxY;
            if (particle.vy > 0) particle.bounceOffHorizontalWall();
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

    particleBounce(k) {
        if (this.particles[k].potted) return;
        let x = this.particles[k].rx;
        let y = this.particles[k].ry;
        let r = Math.floor(x/this.cellWidth);
        let c = Math.floor(y/this.cellWidth);

        for(let i = Math.max(0, r-1); i <= Math.min(r+1, this.gridR -1); ++i) {
            for(let j = Math.max(0, c-1); j <= Math.min(c+1, this.gridC-1); ++j) {
                for(let l of this.grid[i][j]) {
                    if (this.particles[l].potted) continue;
                    if (l <= k) {
                        continue;
                    }
                    if(this.particles[k].checkCollisionWith(this.particles[l])){
                        this.particles[k].bounceOff1(this.particles[l]);
                    }
                }
            }
        }
    }

    bounceParticleIfNeeded(i) {
        this.wallBounce(i);
        this.particleBounce(i);
    }

    simulate(Hz) { 
        //Draw all the particle first of all        
        let points = [];
        for (let i = 0; i < this.particles.length; ++i) {
            if (!this.particles[i].potted || this.particles[i].potProgress < 1) {
                this.particles[i].draw(this.ctx, this.height);
            }
            if(this.withConvexHull) {
                points.push(new Point(this.particles[i].rx, this.particles[i].ry));
            }
        }
        if(this.withConvexHull) {
            let convexHull = new ConvexHull(points);
            convexHull.draw(this.ctx, this.height);
        }

        // Smaller fixed substeps reduce tunnelling while keeping the visible
        // animation speed unchanged.
        const substeps = 3;
        const dt = Hz / substeps;
        for (let step = 0; step < substeps; ++step) {
            for (let i = 0; i < this.particles.length; ++i) {
                this.bounceParticleIfNeeded(i);
            }
            for (let i = 0; i < this.particles.length; ++i) {
                if (!this.particles[i].potted) this.particles[i].move(dt);
            }
            this.rebuildGrid();
            this.time += dt;
        }
    }

}

export default Simulation;
