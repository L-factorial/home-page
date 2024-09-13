class Particle{

    constructor(rx, ry, vx, vy, mass, radius, id, color, withText, img){
        this.rx = rx;
        this.ry = ry;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.radius = radius;
        this.count = 0;
        this.id = id;
        this.color = color;
        this.withText = withText;
        this.img = img;
    }
    getLineConstantsABC(x1, y1, x2, y2) {
        let A = y2-y1;
        let B = x1-x2;
        let C = A*x1 + B*y1;
        return [A, B, C];
    }

    timeToReach(x1, y1, x2, y2, vx, vy) {
        let dx = x2-x1;
        let dy = y2-y1;

        if(dx*vx < 0) {
            return Infinity;
        }
        if(dy*vy < 0) {
            return Infinity;
        }
        if(Math.abs(dx) > 0 && vx == 0) {
            return Infinity;
        }
        if(Math.abs(dy) > 0 && vy == 0) {
            return Infinity;
        }
        return dx/vx; // we can return dy/vy too 
    }

    timeToHit1(that){
        if(this == that){
            return Infinity;
        }
        let l1x1 = this.rx
        let l1y1 = this.ry;
        let l1x2 = l1x1 + this.vx;
        let l1y2 = l1y1 + this.vy;
        let ABC1 = this.getLineConstantsABC(l1x1, l1y1, l1x2, l1y2);
        let A1 = ABC1[0]; let B1 = ABC1[1]; let C1 = ABC1[2];


        let l2x1 = that.rx
        let l2y1 = that.ry;
        let l2x2 = l2x1 + that.vx;
        let l2y2 = l2y1 + that.vy;
        let ABC2 = this.getLineConstantsABC(l2x1, l2y1, l2x2, l2y2);
        let A2 = ABC2[0]; let B2 = ABC2[1]; let C2 = ABC2[2];

        let x = (B2*C1 - B1*C2) / (A1*B2 - A2*B1);
        let y = (A1*C2 - A2*C1) / (A1*B2 - A2*B1);

        let dt1 = this.timeToReach(this.rx, this.ry, x, y, this.vx, this.vy);
        if(dt1 == Infinity) {
            return Infinity;
        }

        let dt2 = this.timeToReach(this.rx, this.ry, x, y, this.vx, this.vy);
        if(dt2 == Infinity) {
            return Infinity;
        }

        //If we considering the precise point collision, dt1 == dt2 ideally, however we have to take raadius into consideration
        //Let us now identify, where that particle will reach when this particle reaches  x, y. 

        let x1 = that.rx+ that.vx*dt1;
        let y1 = that.ry+ that.vy*dt1;
        let dx = x1-x;
        let dy = y1-y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        if(dist > this.radius + that.radius) {
            return Infinity;
        }
        return Math.min(dt1, dt2);
    }

    elasticBounceOff1D(v1i, v2i, m1, m2) {
        let totalMass = m1+m2;
        let delMass = m1-m2;

        let v1f = (delMass/totalMass)*v1i + (2*m2 / totalMass)*v2i;
        let v2f = ((-1.0)*delMass/totalMass)*v2i + (2*m1 / totalMass)*v1i;
        return [v1f, v2f];

    }

    bounceOff(that){
        //Source https://www.youtube.com/watch?v=MJQ9eKGanUs : 8 mins 24 sec
        let finalVelocitiesX = this.elasticBounceOff1D(this.vx, that.vx, this.mass, that.mass);
        let finalVelocitiesY = this.elasticBounceOff1D(this.vy, that.vy, this.mass, that.mass);
        this.vx = finalVelocitiesX[0];
        that.vx = finalVelocitiesX[1];
        this.vy = finalVelocitiesY[0];
        that.vy = finalVelocitiesY[1];

    }


    /**
     * Updates the velocities of this particle and the specified particle according
     * to the laws of elastic collision. Assumes that the particles are colliding
     * at this instant.
     *
     */
    bounceOff1(that) {
            let dx  = that.rx - this.rx;
            let dy  = that.ry - this.ry;
            let dvx = that.vx - this.vx;
            let dvy = that.vy - this.vy;
            let dvdr = dx*dvx + dy*dvy;             // dv dot dr
            let dist = this.radius + that.radius;   // distance between particle centers at collison
    
            // magnitude of normal force
            let magnitude = 2 * this.mass * that.mass * dvdr / ((this.mass + that.mass) * dist);
    
            // normal force, and in x and y directions
            let fx = magnitude * dx / dist;
            let fy = magnitude * dy / dist;
    
            // update velocities according to normal force
            this.vx += fx / this.mass;
            this.vy += fy / this.mass;
            that.vx -= fx / that.mass;
            that.vy -= fy / that.mass;
    
            // update collision counts
            this.count++;
            that.count++;
        }

    checkCollisionWith(that) {
        let dx = this.rx - that.rx;
        let dy = this.ry - that.ry;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist <= this.radius + that.radius) {
            return true;
        }
        return false;
    }

    bounceOffHorizontalWall(){
        this.vy = -1.0 * this.vy;
        this.count++;
    }
    bounceOffVerticalWall(){
        this.vx = -1.0 * this.vx;
        this.count++;
    }

    timeToHitVerticalWall(leftX, rightX) {
        if      (this.vx > 0) return (rightX - this.rx - this.radius) / this.vx;
        else if (this.vx < 0) return (leftX + this.radius - this.rx) / this.vx;  
        else             return -1;
    }

    timeToHitHorizontalWall(bottomY, topY) {
        if      (this.vy > 0) return (topY- this.ry - this.radius) / this.vy;
        else if (this.vy < 0) return (bottomY + this.radius - this.ry) / this.vy;
        else             return -1;
    }

    timeToHit(that) {
        if (this === that) return -1;
        let dx  = that.rx - this.rx;
        let dy  = that.ry - this.ry;
        let dvx = that.vx - this.vx;
        let dvy = that.vy - this.vy;
        let dvdr = dx*dvx + dy*dvy;
        if (dvdr > 0) return -1;
        let dvdv = dvx*dvx + dvy*dvy;
        if (dvdv == 0) return -1;
        let drdr = dx*dx + dy*dy;
        let sigma = this.radius + that.radius;
        let d = (dvdr*dvdr) - dvdv * (drdr - sigma*sigma);
        if (d < 0) return -1;
        return -(dvdr + Math.sqrt(d)) / dvdv;
    }

    move(dt){
        let rx1 = this.rx + this.vx*dt;
        let ry1 = this.ry +this.vy*dt;
        this.rx = rx1;
        this.ry = ry1;
    }

    draw(ctx, height){
        ctx.beginPath();
        ctx.font = this.radius+"px Arial";
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = "1";

        ctx.arc(this.rx, height - this.ry, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        let textVertticalShift = 5;
        let textHorizontalShift = this.id < 10 ? 5 : 8;
        
        if(this.withText) {
            ctx.fillStyle = this.color == "yellow" ? "black" : "white";
            ctx.fillText(""+this.id, this.rx-textHorizontalShift, height - this.ry+textVertticalShift);   
        }

        if(this.img!= null) {
            let sx = 0;
            let sy = 0;
            let dx = this.rx - this.radius;
            let dy = height - this.ry - this.radius
            let dWidth = this.radius*2;
            let dHeight = this.radius*2;


                    //     // Draw the circular path
                    //     ctx.beginPath();
                    //     ctx.arc(this.rx, this.ry, this.radius, 0, Math.PI * 2, true);
                    //     ctx.closePath();
            
                    //     // Clip to the circle
                    //     ctx.clip();

                    //                        // Reset clipping region
                    // ctx.restore();
                    // ctx.save();

            ctx.drawImage(this.img,dx, dy, dWidth, dHeight);
        }
    }

}

export default Particle;