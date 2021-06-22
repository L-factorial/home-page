import Point from '../convex-hull/Point';
import ConvexHull from '../convex-hull/ConvexHull';
import PriorityQueue from './../../data-structure/PriorityQueue'
import Event from './Event'

function compareEvent(e1, e2) {
    return e1.time - e2.time;
}

class EventDrivenSimulation {
    constructor(ctx, particles, width, height, margin, Hz, withConvexHull) {
        this.ctx = ctx;
        this.time = 0.0;
        this.particles = particles;
        this.width = width;
        this.height = height;
        this.cellWidth = 0;
        this.margin = margin;
        this.Hz = Hz;
        this.withConvexHull =  withConvexHull;
        this.pq= new PriorityQueue(compareEvent);
        this.initSimulation();

    }

    predictCollisions(particle) {
        if (particle == null) {
            return;
        }
        let dtY = particle.timeToHitHorizontalWall(this.margin, this.height - this.margin);
        let dtX = particle.timeToHitVerticalWall(this.margin, this.width - this.margin);
        if (dtY >= 0) {
            this.pq.offer(new Event(this.time + dtY, null, particle));
        }
        if (dtX >= 0) {
            this.pq.offer(new Event(this.time + dtX, particle, null));
        }
        for(let i = 0; i < this.particles.length; ++i){
            let dt = particle.timeToHit(this.particles[i]);
            if(dt >= 0) {
                this.pq.offer(new Event(this.time + dt, particle, this.particles[i]))
            }
        }
    }

    redraw() {
        for (let i = 0; i < this.particles.length; ++i) {
            this.particles[i].draw(this.ctx, this.height);
        }
        let redrawEventTime = this.time + 1.0/this.Hz;
        let e = new Event(redrawEventTime, null, null);
        this.pq.offer(e);
    }

    initSimulation() {
        let l = this.particles.length;

        for (let i = 0; i < this.particles.length; ++i) {
            this.predictCollisions(this.particles[i]);
        }
        this.pq.offer(new Event(0.0, null, null));
    }

    simulate(Hz) { 
        while(!this.pq.empty()){
            let event = this.pq.poll();

            if (!event.isValid()){
                continue;
            } 

            let particleA = event.particleA;
            let particleB = event.particleB;

            // physical collision, so update positions, and then simulation clock
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].move(event.time - this.time);
            }
            this.time = event.time;

            // process event
            if      (particleA != null && particleB != null) {
                particleA.bounceOff1(particleB);              // particle-particle collision
            }
            else if (particleA != null && particleB == null) {
                particleA.bounceOffVerticalWall();   // particle-wall collision
            }
            else if (particleA == null && particleB != null) {
                particleB.bounceOffHorizontalWall(); // particle-wall collision
            }
            else if (particleA == null && particleB == null) {
                this.redraw();               /// redraw event
            }

            // update the priority queue with new collisions involving a or b
            this.predictCollisions(particleA);
            this.predictCollisions(particleB);

            break;
        }
    }

}

export default EventDrivenSimulation;
