class Event {
    constructor(time, particleA, particleB){
        this.time = time;
        this.particleA = particleA;
        this.particleB = particleB;
        this.countA = -1;
        this.countB = -1;
        if(particleA != null) {
            this.countA = particleA.count;
        }
        if(particleB != null){
            this.countB = particleB.count;
        }
    }

    isValid(){
        if(this.particleA !== null && this.particleA.count !== this.countA) {
            return false;
        }
        if(this.particleB !== null && this.particleB.count !== this.countB) {
            return false;
        }
        return true;
    }
}

export default Event;