class PrioityQueue {
    constructor(comparator) {
        this.heap = [];
        this.size = 0;
        this.comparator = comparator;
    }
    poll() {
        if (this.size <= 0) {
            throw "Polling an empty PriorityQueue"
        }
        let ret = this.heap[0];
        this.swap(0, this.size - 1);
        this.heap = this.heap.slice(0, this.size - 1);
        this.size--;

        this.sink(0);
        return ret;
    }
    peek() {
        if (this.size > 0) {
            return this.heap[0];
        }
        throw "Peeeking an empty PriorityQueue"
    }

    offer(item) {
        this.heap.push(item)
        this.swim(this.size);
        this.size++;
    }

    empty() {
        return this.size <= 0;
    }
    swim(i) {
        while (i > 0) {
            var p = this.parent(i);
            let comp = this.comparator(this.heap[i], this.heap[p]);
            if (comp < 0) {
                this.swap(i, p);
                i = p;
            }
            else {
                break;
            }
        }
    }

    sink(i) {
        if (i >= this.size) {
            return;
        }
        var c = this.left(i);
        if (c <= this.size - 1) {
            var rc = this.right(i);
            if (rc <= this.size - 1 && this.comparator(this.heap[rc], this.heap[c]) < 0) {
                c = rc;
            }
            if (this.comparator(this.heap[c], this.heap[i]) < 0) {
                this.swap(i, c);
                this.sink(c);
            }

        }

    }
    swap(i, j) {
        let temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    parent(i) {
        if (i % 2 == 0) {
            return i / 2 - 1;
        }
        return (i - 1) / 2;
    }
    left(i) {
        return i * 2 + 1;
    }
    right(i) {
        return i * 2 + 2;
    }
    show() {
        console.log(this.heap.slice(0, this.size))
    }
}
 export default PrioityQueue