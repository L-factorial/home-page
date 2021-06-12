import State from './State'
import PrioityQueue from './../../data-structure/PriorityQueue'

function stateCompare(s1, s2) {
    return (s1.cost + s1.manhattanDistToGoal()) - (s2.cost + s2.manhattanDistToGoal());
}

class EightPuzzleSimulation {
    constructor(arr) {
        this.initialState = new State(arr, 0);
        this.path = [];
        this.pq = new PrioityQueue(stateCompare);
        this.parentMap = new Map();
        this.pq.offer(this.initialState);
        this.parentMap.set(this.initialState.hashKey(), null);
        this.path = [];
        this.solve();

    }
    solve() {
        var found = false;
        while (!this.pq.empty() && !found) {
            let state = this.pq.poll();
            let babies = state.children();

            for (let i = 0; i < babies.length; ++i) {
                let baby = babies[i];
                let babyKey = baby.hashKey();
                if (this.parentMap.has(babyKey)) {
                    continue;
                }
                this.parentMap.set(babyKey, state.hashKey());
                this.pq.offer(baby);
                if (baby.isGoal()) {
                    found = true;
                    let curr = babyKey;
                    while (curr != null) {
                        this.path.push(curr);
                        curr = this.parentMap.get(curr);
                    }
                    this.path.reverse();
                }
            }
        }
    }
    solution() {
        return this.path;
    }

}

export default EightPuzzleSimulation;