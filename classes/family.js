class _Family {
    constructor(size) {
        this.size = size||Math.floor(Math.random()*(5-1)+1);

        this.members = [];

        this.Populate();

        this.wealth = this.CalcWealth();

        Sim.families.push(this);

        this.MoveIn();
    }

    MoveIn() {
        this.house = new Sim.House(this);
        this.house.Init();
    }

    CalcWealth() {
        let r = 5000;

        const f = this.members.filter(m=>m.age>=16);
        for (const m of f) {
            if (m.age >= 20) {
                r += Math.floor(Math.random()*4)*1000;
            } else {
                r += Math.floor(Math.random()*8)*100;
            }
        }

        return r;
    }

    Populate() {
        if (this.size === 1) {
            this.members.push(new Sim.Human(undefined, undefined, undefined, this));
        } else if (this.size >= 2) {
            const h1 = new Sim.Human(undefined, undefined, true, this);
            const h2 = new Sim.Human(undefined, undefined, false, this);

            const r = new Sim.Relation(h1, h2, 100, 100, ["Married"]);
            h1.Relationships[h2.index] = r;
            h2.Relationships[h1.index] = r;

            this.members.push(h1, h2);

            if (this.size > 2) {
                const a = [];
                for (let i = 2; i<this.size; i++) {
                    const mAge = (h1.age<=h2.age?h1.age:h2.age)-18;
                    const age = Math.floor(Math.random()*(mAge-3)+3);

                    const h = new Sim.Human(undefined, age, undefined, this);

                    h.Relationships[h1.index] = new Sim.Relation(h, h1, 100, 0, ["Parent"]);
                    h.Relationships[h2.index] = new Sim.Relation(h, h2, 100, 0, ["Parent"]);
                    
                    h1.Relationships[h.index] = new Sim.Relation(h1, h, 100, 0, ["Child"]);
                    h2.Relationships[h.index] = new Sim.Relation(h2, h, 100, 0, ["Child"]);

                    a.push(h);
                }
                for (const h of a)
                    this.members.push(h);
            }
        }
    }

    get DName() {
        return this.name.colour(69);
    }
}

Sim.Family = _Family;

/*
for (const f of Sim.families) {
    console.log(`The ${f.DName} Family`);
    for (const m of f.members) {
        console.log(`- ${m.DName} (${m.age})`);
    }
}
*/