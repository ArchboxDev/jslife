class _Human {
    constructor(name, age, gender = Sim.RandomGender(), family, x = {}) {
        this.gender = gender===true||gender=="male"?true:false;

        this.name = name||Sim.GenerateName(this.gender?"male":"female");

        if (!this.name.full)
            this.name.full = `${this.name.first} ${this.name.last}`;

        if (family && family.name) {
            this.name.last = family.name;
            this.name.full = `${this.name.first} ${this.name.last}`;
        } else if (family)
            family.name = this.name.last;
        this.family = family;

        this.age = age||Math.floor(Math.random()*(35-19)+19);

        this.HealthValues = {
            Food: 100,
            Rest: 100,
            Fitness: 100,
            Happiness: 100
        }

        this.Traits = {};

        this.Relationships = [];

        for (const v in x)
            this[v] = x[v];

        this.CreateTraits();

        this.dead = false;

        this.index = Sim.people.push(this);
    }

    get Health() {
        let h = 100;

        h = this.HealthValues.Food/100>=1.75||this.HealthValues.Food/100<=0.25?h-25:h;

        h = this.HealthValues.Rest/100<=0.25?h-25:h;

        h = this.HealthValues.Fitness/100<=0.25?h-25:h;

        h = this.HealthValues.Happiness/100<=0.25?h-25:h;

        h -= this.age-32;

        return h;
    }

    get DName() {
        let c = this.gender!==null?this.gender?39:213:124; //Male:Female:SUPER AIDS//

        return this.name.full.colour(c);
    }

    CreateTraits() {
        this.Traits = {
            Luck: 0
        };

        for (const t in this.Traits) {
            let v1;
            let v2;

            let b = Math.floor(Math.random()*40);

            for (const pi in this.Relationships) {
                if (this.Relationships[pi] === "Parent") {
                    const pa = Sim.people[pi];
                    if (pa) {
                        if (v2)
                            v1 = pa.Traits[t];
                        else
                            v2 = pa.Traits[t];
                    }
                }
            }

            if (!v1)
                v1 = Math.floor(Math.random()*Sim.Roll()?30:60);
            if (!v2)
                v2 = Math.floor(Math.random()*Sim.Roll()?30:60);

            b = b+v1^v2;

            if (b === NaN)
                b = 42;

            if (b > 100)
                b = 100;
            if (b < 0)
                b = 0;

            this.Traits[t] = b;
        }
    }

    DeathCheck() {
           // Visualisation                         //
          // https://hack-my-mainfra.me/8fe422.png //
         // Block Altogether: [10000]             //
        // H[2500]A[2500]R[500]B[3500]T[1000]   //

        const Block = {
            Health : {
                Pos: 0,
                Sp : 2500,
                Val: this.Health
            },
            Age    : {
                Pos: 2500,
                Sp : 2500,
                Val: (this.age/20)*50,
            },
            Rand   : {
                Pos: 5000,
                Sp : 500,
                Val: Math.floor(Math.random()*Sim.Roll()?5:10)
            },
            Blank  : {
                Pos: 5500,
                Sp : 3500,
                Val: 0,
            },
            Trait  : {
                Pos: 9000,
                Sp : 1000,
                Val: 0
            }
        };
        
        const Roll = Math.floor(Math.random()*(Sim.Roll()?8000:4000-Sim.Roll()?1000:8000)+1000);

        for (const BI in Block) {
            const BV = Block[BI];

            const Min = BV.Pos;
            const Max = BV.Pos+BV.Val;

            if (Roll>Min && Roll<Max) {
                this.dead = true;
                Sim.events.push(`${this.DName} died from Block ${BI}, aged ${this.age}, rolled ${Roll}`);
            }
        }
    }

    Birthday() {
        this.age++;

        let e;

        if (this.age===5)
            e = `${this.DName} is starting ${this.gender?"his":"her"} first year of school.`

        if (this.age===13)
            e = `It's ${this.DName}'s 13th birthday!`;
        else if (this.age===18)
            e = `It's ${this.DName}'s 18th birthday!`;
        else if (this.age===21)
            e = `It's ${this.DName}'s 21st birthday! Health: ${this.Health}`;
        else if (this.age===100)
            e = `It's ${this.DName}'s 100th birthday!`;
        
        if (e)
            Sim.events.push(e);
    }

    TriggerSuperAIDs() {
        console.log(`${this.DName} has caught ${"SUPER AIDS".colour(196)}!`);

        this.gender = null;
        this.SuperAIDs = true;
    }

    RerollGeneration() {
        this.gender = Sim.RandomGender()=="male"?true:false;
        this.name = Sim.GenerateName(this.gender?"male":"female");
    }
}

Sim.Human = _Human;

/*
function SuperAIDs() {
    const h = [];
    for (let i = 0; i<30; i++)
        h.push(new Sim.Human());
    for (const p of h)
        p.TriggerSuperAIDs();
    console.log(`Everybody caught ${"SUPER AIDS".colour(196)} and died.`);
}
*/