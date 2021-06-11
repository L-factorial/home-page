class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //Cross product of p0p1 and p0p2
    corssProduct(p1, p2) {
        let p0 = this;
        return (p1.x - p0.x)*(p2.y - p0.y)   - (p2.x -p0.x)*(p1.y - p0.y);

    }
    // this point is strictly right of vector  pq
    isRightOf(p, q) {
        let a = this.x; let b = this.y; let c = 1;
        let d = p.x; let e = p.y; let f = 1;
        let g = q.x; let h = q.y; let i = 1;
        let det = (a*e*i) - (a*f*h) - (b*d*i) + (b*f*g) + (c*d*h) -(c*e*g);
        return det < 0;
    }

        // this point is strictly left of vector  pq
    isLeftOf(p, q) {
        let a = this.x; let b = this.y; let c = 1;
        let d = p.x; let e = p.y; let f = 1;
        let g = q.x; let h = q.y; let i = 1;
        let det = (a * e * i) - (a * f * h) - (b * d * i) + (b * f * g) + (c * d * h) - (c * e * g);
        return det > 0;
    }

    //returns true if the vector (oritin, tihsPoint) is clockwise to vector (origin, p)
    isClockWiseToFromOrigin(p) {
        return (this.x * p.y - p.x * this.y) > 0;
    }


    //returns true if the vector (oritin, tihsPoint) is clockwise to vector (origin, p)
    isAntiClockWiseToFromOrigin(p) {
        return (this.x * p.y - p.x * this.y) < 0;
    }

    // returns true if the angle (this, p1, p2) turns left
    turnsLeft(p0, p1) {
        let p2 = this;
        return p0.corssProduct(p1, p2) > 0;
    }

    // returns true is the angle (this, p1, p2) turns right
    turnsRight(p0, p1) {
        let p2 = this;
        return p0.corssProduct(p1, p2) < 0;
    }
}

export default Point;