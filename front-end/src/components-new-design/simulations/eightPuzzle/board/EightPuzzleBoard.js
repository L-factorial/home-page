import State from '../../../../simulation-logic/eight-puzzle/State';
import EightPuzzleSimulation from '../../../../simulation-logic/eight-puzzle/a-star';

class EightPuzzleBoard {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.totalShuffle = 200;
        this.arr = [[7, 4, 3], [8, 9, 5], [2, 1, 6]];
        this.eightPuzzle = new EightPuzzleSimulation(this.arr);
        this.path = this.eightPuzzle.solution();
        this.pathPos = 0;
        this.solvedFrames = 0;
        this.animationFrame = null;
        this.isAnimating = false;
        this.boardSize = Math.min(canvas.width * 0.72, canvas.height * 0.78, 620);
        this.gap = Math.max(8, this.boardSize * 0.025);
        this.block = (this.boardSize - this.gap * 4) / 3;
        this.rectX = (canvas.width - this.boardSize) / 2;
        this.rectY = (canvas.height - this.boardSize) / 2;
    }

    roundedRect(x, y, width, height, radius) {
        const ctx = this.ctx;
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    shuffle() {
        for (let i = 0; i < this.totalShuffle; ++i) {
            const children = new State(this.arr).children();
            this.arr = children[Math.floor((Math.random() * 50) % children.length)].arr;
        }
        this.eightPuzzle = new EightPuzzleSimulation(this.arr);
        this.path = this.eightPuzzle.solution();
    }

    drawBoardSurface() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();
        this.roundedRect(this.rectX, this.rectY, this.boardSize, this.boardSize, 20);
        const surface = ctx.createLinearGradient(this.rectX, this.rectY, this.rectX + this.boardSize, this.rectY + this.boardSize);
        surface.addColorStop(0, '#263a31');
        surface.addColorStop(1, '#14231c');
        ctx.fillStyle = surface;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.42)';
        ctx.shadowBlur = 32;
        ctx.shadowOffsetY = 14;
        ctx.fill();
        ctx.restore();

        ctx.save();
        this.roundedRect(this.rectX, this.rectY, this.boardSize, this.boardSize, 20);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.stroke();
        ctx.restore();
    }

    drawTile(value, x, y) {
        const ctx = this.ctx;
        const empty = value === '9';
        ctx.save();
        this.roundedRect(x, y, this.block, this.block, Math.max(8, this.block * 0.07));

        if (empty) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
            ctx.fill();
            ctx.restore();
            return;
        }

        const tile = ctx.createLinearGradient(x, y, x, y + this.block);
        tile.addColorStop(0, '#eaff9d');
        tile.addColorStop(1, '#c6e95c');
        ctx.fillStyle = tile;
        ctx.shadowColor = 'rgba(4, 12, 8, 0.36)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 5;
        ctx.fill();
        ctx.fillStyle = '#1a2a22';
        ctx.font = `650 ${Math.max(28, this.block * 0.36)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, x + this.block / 2, y + this.block / 2);
        ctx.restore();
    }

    showEightPuzzleCurrentBoard() {
        this.drawState(this.path[this.pathPos]);
    }

    tilePosition(index) {
        return {
            x: this.rectX + this.gap + (index % 3) * (this.block + this.gap),
            y: this.rectY + this.gap + Math.floor(index / 3) * (this.block + this.gap),
        };
    }

    normalizeState(state) {
        if (typeof state === 'string') return Array.from(state);
        if (Array.isArray(state)) return state.flat().map(String);
        if (state && Array.isArray(state.arr)) return state.arr.flat().map(String);
        return [];
    }

    drawState(state) {
        this.drawBoardSurface();
        this.normalizeState(state).forEach((value, index) => {
            const position = this.tilePosition(index);
            this.drawTile(String(value), position.x, position.y);
        });
    }

    animateNextMove() {
        if (this.isAnimating || this.pathPos >= this.path.length - 1) return;
        this.isAnimating = true;
        const fromState = this.normalizeState(this.path[this.pathPos]);
        const toState = this.normalizeState(this.path[this.pathPos + 1]);
        const start = performance.now();
        const duration = 620;

        const render = (now) => {
            const rawProgress = Math.min((now - start) / duration, 1);
            const progress = 1 - Math.pow(1 - rawProgress, 3);
            this.drawBoardSurface();

            fromState.forEach((value, fromIndex) => {
                if (value === '9') return;
                const toIndex = toState.indexOf(value);
                const from = this.tilePosition(fromIndex);
                const to = this.tilePosition(toIndex);
                this.drawTile(
                    value,
                    from.x + (to.x - from.x) * progress,
                    from.y + (to.y - from.y) * progress
                );
            });

            if (rawProgress < 1) {
                this.animationFrame = requestAnimationFrame(render);
            } else {
                this.pathPos += 1;
                this.isAnimating = false;
                this.animationFrame = null;
                this.drawState(toState);
            }
        };

        this.animationFrame = requestAnimationFrame(render);
    }

    showBoard() {
        if (this.isAnimating) return;
        if (this.pathPos < this.path.length - 1) {
            this.animateNextMove();
        } else if (this.solvedFrames < 3) {
            this.solvedDisplay();
            ++this.solvedFrames;
        } else {
            this.pathPos = 0;
            this.solvedFrames = 0;
            this.shuffle();
            this.showEightPuzzleCurrentBoard();
        }
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }

    solvedDisplay() {
        this.drawBoardSurface();
        const ctx = this.ctx;
        const width = Math.min(this.boardSize * 0.78, 390);
        const height = Math.max(54, this.boardSize * 0.12);
        const x = this.rectX + (this.boardSize - width) / 2;
        const y = this.rectY + (this.boardSize - height) / 2;
        ctx.save();
        this.roundedRect(x, y, width, height, 12);
        ctx.fillStyle = 'rgba(213, 255, 95, 0.12)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(213, 255, 95, 0.42)';
        ctx.stroke();
        ctx.fillStyle = '#eaffad';
        ctx.font = `600 ${Math.max(13, this.boardSize * 0.032)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Solved · Preparing a new board', this.canvas.width / 2, this.canvas.height / 2);
        ctx.restore();
    }
}

export default EightPuzzleBoard;
