class _House {
    constructor(family) {
        this.family = family;
    }

    CalcQuality() {
        return this.family.wealth/1000;
    }

    CalcComfort() {
        return (this.quality*10)/this.family.size;
    }

    Init() {
        this.quality = this.CalcQuality();
        this.comfort = this.CalcComfort();
    }
}

Sim.House = _House;