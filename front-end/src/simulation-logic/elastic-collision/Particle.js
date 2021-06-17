class Particle{

    constructor(rx, ry, vx, vy, mass, radius, id, color, withText){
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
    }

}

export default Particle;