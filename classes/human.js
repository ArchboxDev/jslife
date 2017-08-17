class _Human {
    constructor(name, age, gender = Sim.RandomGender(), family, x = {}) {
        this.male = gender===true||gender=="male"?true:false;

        this.name = name||Sim.GenerateName(this.male?"male":"female");

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

        //MBTI values, using the "closed" values as 0 and the "open" values as 1000. 
        this.PersonalityValues = {
            Introvertion: Math.floor(Math.random()*1000),
            Observance: Math.floor(Math.random()*1000),
            Thinking: Math.floor(Math.random()*1000),
            Judging: Math.floor(Math.random()*1000)
        }

        this.Traits = {};

        this.Relationships = [];

        for (const v in x)
            this[v] = x[v];

        this.CreateTraits();
        
        if (this.age>=18)
            this.ChooseJob();

        this.dead = false;

        this.index = Sim.people.push(this);
    }

    get Health() {
        let h = 100;

        h = this.HealthValues.Food/100>=1.75||this.HealthValues.Food/100<=0.25?h-25:h;

        h = this.HealthValues.Rest/100<=0.25?h-25:h;

        h = this.HealthValues.Fitness/100<=0.25?h-25:h;

        h = this.HealthValues.Happiness/100<=0.25?h-25:h;

        h += this.age-32;

        if (this.SuperAIDs)
            h += 10000;

        return h;
    }

    get DName() {
        let c = this.male!==null?this.male?39:213:124; //Male:Female:SUPER AIDS//

        return this.name.full.colour(c);
    }
    //For displays
    get CondensedPersonality () {

    }

    GenderText (capital) {
        if (this.male) {if (capital) {return 'He'} else {return 'he'}}
        else if (!this.male) {if (capital) {return 'She'} else {return 'she'}};
    }

    //Rolls a dice and sees if this person is likely to react positively.
    PersonalityDice (stimuli) {
        //If the person has a indicator higher (or lower, specify true for the first argument) than the indicator here, they will react positively. Else, they will be neutral.
        const stimuliTypes = {
            //According to 16personalities research (https://www.16personalities.com/articles/personality-bites-the-types-and-stress-eating)
            Eating: {
                Introvertion: ["lower", 300],
                Observance: ["higher", 600],
                Thinking: ["higher", 700],
                Judging: ["lower", 300]
            }
        }

        if (!stimuli) {throw new Error("You need to pass a type of stimuli to the Personality Dice.")};
        if (stimuli in stimuliTypes) {
            let reaction = 500;
            //spent 10 minutes mulling over the variable name kms
            const stim = stimuliTypes[stimuli];
            for (let i in stim) {
                const val = this.PersonalityValues[i];
                if (stim[i][0] === "lower") {
                    reaction = val <= stim[i][1] ?reaction+100:reaction-100;
                }
                else if (stim[i][0] === "higher") {
                    reaction = val >= stim[i][1]?reaction+100:reaction-100;
                }
            }
            if (reaction >= 500) return true;
            else return false; 
        }
        else {throw new Error("Stimuli passed into the Personality Dice is not a vaild stimuli")}
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
                if (this.Relationships[pi].Relation.includes("Parent")) {
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
    
    ChooseJob() {
        // Todo: Change based on traits, skills, etc //
        this.job = new Sim.Job(this);
    }

    DeathCheck() {
           // Visualisation                         //
          // https://hack-my-mainfra.me/8fe422.png //
         // Block Altogether: [10000]             //
        // H[2500]A[2500]R[500]B[3500]T[1000]    //

        const Block = {
            Health : {
                Pos: 0,
                Sp : 2500,
                Val: this.Health
            },
            Age    : {
                Pos: 2500,
                Sp : 2500,
                Val: (this.age/20)*30,
            },
            Rand   : {
                Pos: 5000,
                Sp : 500,
                Val: Math.floor(Math.random()*Sim.Roll()?10:15)
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
                if (BI !== "Rand") {
                    if (BI === "Health") {
                        let s;

                        if (this.SuperAIDs)
                            s = "SUPER AIDS";
                        
                        if (!s) {
                            const sel = ["Diabetes", "Stroke", "HIV", "AIDS", "Cancer", "Poisoning", "Epilepsy", "Hepatitis B"];
                            s = sel[Math.floor(Math.random()*sel.length)];
                        }

                        this.Die(s);
                    }

                    if (BI === "Age") {
                        this.Die("Age");
                    }
                } else {
                    this.TriggerSuperAIDs();
                }
                break;
            }
        }
    }

    Die (cause) {
        this.dead = true;
        switch (cause) {
            case "Age": Sim.events.push(`${this.DName}, aged ${this.age}, died from old age. ${this.GenderText(true)} was a ${this.job.DName}.`); break;
            case "Collapse": Sim.events.push(`${this.DName}, aged ${this.age}, couldn't run fast enough while their home was collapsing. ${this.GenderText(true)} was a ${this.job.DName}.`); break;
            default: Sim.events.push(`${this.DName}, aged ${this.age}, died from ${cause.colour(160)}. ${this.GenderText(true)} was a ${this.job.DName}.`); break;
        }
        this.deathReason = cause;
    }

    Yearly() {
        this.age++;

        const e = [];

        switch (this.age) {
            case 5:
                e.push(`${this.DName} is starting ${this.male?"his":"her"} first year of school.`);
                break;
            case 13:
                e.push(`It's ${this.DName}'s 13th birthday!`);
                break;
            case 18:
                e.push(`It's ${this.DName}'s 18th birthday!`);
                break;
            case 21:
                e.push(`It's ${this.DName}'s 21st birthday!`);
                break;
            case 100:
                e.push(`It's ${this.DName}'s 100th birthday!`);
        }

        if (this.job)
            this.job.Yearly();
        else if (this.age>=18)
            this.ChooseJob();
        
        for (const ev of e)
            Sim.events.push(ev);
    }

    TriggerSuperAIDs() {
        this.male = null;
        this.SuperAIDs = true;

        Sim.events.push(`${this.DName} has caught ${"SUPER AIDS".colour(196)}!`);
    }

    RerollGeneration() {
        this.male = Sim.RandomGender()=="male"?true:false;
        this.name = Sim.GenerateName(this.male?"male":"female");
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
