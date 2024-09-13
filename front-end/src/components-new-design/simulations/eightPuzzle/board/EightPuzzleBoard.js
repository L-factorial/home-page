
import State from '../../../../simulation-logic/eight-puzzle/State';
import EightPuzzleSimulation from '../../../../simulation-logic/eight-puzzle/a-star';

class EightPuzzleConfig {
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;
        this.totalShuffle = 200;
        this.arr = [
        [7, 4, 3], 
        [8, 9, 5], 
        [2, 1, 6]]
        ;
        this.eightPuzzle = new EightPuzzleSimulation(this.arr);
        this.path = this.eightPuzzle.solution();
        this.pathPos = 0;
        this.blockMargin  = Math.min(this.canvas.width, this.canvas.height)/10;
        this.block = Math.min(this.canvas.width, this.canvas.height)/3 - this.blockMargin;
        this.rectWidth = (this.block * 3) + this.blockMargin/10;
        this.rectHeight = this.rectWidth;
        this.rectX =  (this.canvas.width / 2) - (this.rectWidth / 2);
        this.rectY = (this.canvas.height / 2) - (this.rectHeight / 2);

 
    }
    shuffle() {
        for (let i = 0; i < this.totalShuffle; ++i) {
            let s = new State(this.arr);
            let babies = s.children();
            let r = Math.floor((Math.random() * 50)%babies.length);
            this.arr = babies[r].arr;
        }
        this.eightPuzzle = new EightPuzzleSimulation(this.arr);
        this.path = this.eightPuzzle.solution();
    }
    showEightPuzzleCurrentBoard(){
        var x = this.rectX;
        var y = this.rectY;
        var k = 0;
        for (let r = 0; r < 3; ++r) {
            x = this.rectX;
            for (let c = 0; c < 3; ++c) {
                let c = this.path[this.pathPos][k];
                let empty = c == '9';
                this.ctx.beginPath();
                this.ctx.font = (this.block - 10) + "px Arial";
                this.ctx.fillStyle = 'red';
                if (empty) {
                    this.ctx.fillStyle = 'white';
                }
                this.ctx.strokeStyle = 'black';
                this.ctx.arc(x + this.block / 2, y + this.block / 2, (this.block / 2) - 5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.fillStyle = "white"
                if (!empty) {
                    this.ctx.fillText("" + this.path[this.pathPos][k], (x + this.block / 2) - this.blockMargin*0.75, (y + this.block / 2) + this.blockMargin*0.75);
                }
                ++k;
                x = x + this.block;
            }

            y = y + this.block;
        }
    }

    showBoard(){
        this.ctx.beginPath();
        this.ctx.lineWidth = "6";
        this.ctx.strokeStyle = "red";
        this.ctx.rect(this.rectX, this.rectY, this.rectWidth, this.rectHeight);
        this.ctx.stroke();
        var x = this.rectX;
        var y = this.rectY;
        var k = 0;
    
        if (this.pathPos < this.path.length) {
            this.showEightPuzzleCurrentBoard();
            ++this.pathPos;
        }
        else if(this.pathPos < this.path.length+2) {
            this.ctx.lineWidth = "6";
            this.ctx.strokeStyle = "red";
            this.ctx.fillStyle = "black";
            this.ctx.rect(this.rectX, this.rectY, this.rectWidth, this.rectHeight);
            this.ctx.stroke();
            this.ctx.fill();
            ++this.pathPos;
        }
        else if(this.pathPos < this.path.length+5) {
            this.solvedDisplay();
            ++this.pathPos;
    
        } 
        else {
            this.ctx.lineWidth = "6";
            this.ctx.strokeStyle = "red";
            this.ctx.fillStyle = "black";
            this.ctx.rect(this.rectX, this.rectY, this.rectWidth, this.rectHeight);
            this.ctx.stroke();
            this.ctx.fill();
            this.pathPos = 0;
            this.shuffle();
        }
    
    }

    solvedDisplay() {
        this.ctx.font = (this.block/10) + "px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Solved. Shuffling the board for new config...", this.rectX +75, (this.canvas.height / 2) + 75);
    }
}

export default EightPuzzleConfig;