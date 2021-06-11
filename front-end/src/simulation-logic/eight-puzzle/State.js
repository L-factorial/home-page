class State {
    constructor(arr, cost) {
        this.arr = arr;
        this.emptySlotR = 0;
        this.emptySlotC = 0;
        this.cost = cost;
        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                if (this.arr[r][c] == 9) {
                    this.emptySlotR = r;
                    this.emptySlotC = c;
                }
            }
        }
    }

    children() {
        let babies = [];
        let dirR = [-1, 0, 1, 0]; // up, right, down, left
        let dirC = [0, 1, 0, -1]; // up, right, down, left

        for (let i = 0; i < 4; ++i) {
            let r = this.emptySlotR + dirR[i];
            let c = this.emptySlotC + dirC[i];
            if (r >= 0 && r < 3 && c >= 0 && c < 3) {
                let clonedArr = [];
                for (let k = 0; k < 3; ++k) {
                    clonedArr.push([]);
                    for (let l = 0; l < 3; ++l) {
                        clonedArr[k].push(this.arr[k][l]);
                    }
                }
                //Swap with empty slot for r and c 
                let temp = this.arr[r][c];
                clonedArr[r][c] = 9;
                clonedArr[this.emptySlotR][this.emptySlotC] = temp;

                babies.push(new State(clonedArr, this.cost + 1));
            }
        }
        return babies;
    }

    hashKey() {
        var key = "";
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                key = key + this.arr[r][c];
            }
        }
        return key;
    }

    manhattanDistToGoal() {
        var dist = 0;
        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                let v = this.arr[r][c];
                let rv = Math.floor((v - 1) / 3);
                let cv = (v - 1) % 3;
                dist = dist + Math.abs(rv - r) + Math.abs(cv - c);
            }
        }
        return dist;
    }

    isGoal() {
        let dist = this.manhattanDistToGoal();
        return dist == 0;
    }

    show() {
        console.table(this.arr);
    }
}

export default State;