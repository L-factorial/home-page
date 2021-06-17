import Point from './Point'

function comparePoint(p1, p2) {
    if(p1.x == p2.x) return p1.y - p2.y;
    return p1.x - p2.x;
}
class ConvexHull {
    constructor(points) {
        this.points = points;
        this.points.sort(comparePoint);
        this.ch =  this.compute();
    }


    upperConverHull() {
        var stack = [];
        stack.push(this.points[0]);
        stack.push(this.points[1]);
        for(let i = 2; i < this.points.length; ++i) {
            while(stack.length >=2 && this.points[i].turnsLeft(stack[stack.length-2], stack[stack.length-1])) {
                stack = stack.slice(0, stack.length-1);
            }
            stack.push(this.points[i]);

        }
        return stack;
    }


    lowerConvexHull(){
        var stack = [];
        stack.push(this.points[0]);
        stack.push(this.points[1]);
        for(let i = 2; i < this.points.length; ++i) {
            while(stack.length >=2  && this.points[i].turnsRight(stack[stack.length-2], stack[stack.length-1])  ) {
                stack = stack.slice(0, stack.length-1);

            }
            stack.push(this.points[i]);
        }
        return stack;
    }

    compute(){
        let uch = this.upperConverHull();
        let lch = this.lowerConvexHull();
        for(let i = lch.length - 2; i >=0; --i) {
            uch.push(lch[i]);
        }
        return uch;
    }

    draw(ctx, height) {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(this.ch[0].x, height - this.ch[0].y);
        ctx.lineWidth = "0.2";

        for(let i = 1; i < this.ch.length; ++i){
            ctx.lineTo(this.ch[i].x, height - this.ch[i].y);
            ctx.stroke();

        }
    }
}

export default ConvexHull;