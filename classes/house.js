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
    Collapse () {
        for (let i = 0; i < this.family.members.length; i++) {
            if(this.family.members[i].HealthValues.Fitness < Math.random() * (this.quality + 200)) this.family.members[i].Die("Collapse") ;
        }
        this.family.house = null;
        this.family.MoveIn(); //for now
    }
}

Sim.House = _House;