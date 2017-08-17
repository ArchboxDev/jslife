require("./lib/config");
//require("keypress")(process.stdin);

class _Sim {
    constructor() {
    }

    NameInfo() {
        const fM = this.names.first.male.length;
        const fF = this.names.first.female.length;
        const lG = this.names.last.length;

        console.log("[Name Information]".colour(30));
        console.log(`${"First Names (Male):".colour(39)} ${fM.toString().colour(fM>=100?46:196)}`);
        console.log(`${"First Names (Female):".colour(39)} ${fF.toString().colour(fF>=100?46:196)}`);
        console.log(`${"Last Names:".colour(39)} ${lG.toString().colour(lG>=100?46:196)}`);
    }

    Roll() {
        let d;

        const r1 = Math.floor(Math.random()*1000);
        d = r1>=500;

        const r2 = Math.floor(Math.random()*1000);
        return r2>=500 === d;
    }

    RandomGender() {
        return this.Roll()?"male":"female";
    }

    GenerateName(f = this.RandomGender()) {
        const fnS = this.names.first[f];
        const lnS = this.names.last;

        let s = {};

        s.first = fnS[Math.floor(Math.random()*fnS.length)];
        s.last = lnS[Math.floor(Math.random()*lnS.length)];

        s.full = `${s.first} ${s.last}`;

        return s;
    }

    GetNameContent() {
        this.names = {
            first: {
                male: [],
                female: []
            },
            last:  []
        };

        // First Names: Male //

        const fM = fs.readFileSync("./content/firstnames0", "utf8").split("\n");
        for (const n of fM)
            this.names.first.male.push(n);

        // First Names: Female //

        const fF = fs.readFileSync("./content/firstnames1", "utf8").split("\n");
        for (const n of fF)
            this.names.first.female.push(n);
        
        // Last Names //

        const l = fs.readFileSync("./content/lastnames", "utf8").split("\n");
        for (const n of l)
            this.names.last.push(n);
    }

    Populate() {
        const r = Math.floor(Math.random()*(20-10)+10);
        for (let i = 0; i<r; i++) {
            const f = new Sim.Family();
            console.log(`${f.DName} ${"family created with".colour(75)} ${f.size.toString().colour(69)} ${"members".colour(75)}`);
        }
    }

    LoadStuffs() {
        require("./classes/human");
        require("./classes/family");
        require("./classes/house");
        require("./classes/relationship");
        require("./classes/job")
    }

    _eventsIO_On() {
        this.eIOOn = true;
        process.stdin.resume();
    }

    _eventsIO_Off() {
        this.eIOOn = false;
        process.stdin.pause();
    }

    Year() {
        this.year++;

        this.DoActivities();

        for (const p of this.people) {
            if (!p.dead) {
                p.Yearly();
                if (p.age>16)
                    p.DeathCheck();
            }
        }
    }
    
    DoActivities () {
        for (const i of this.families) {
            if (i.house.quality < 5 && Sim.Roll() === true) {
                console.log(`Collapse! The ${i.name} family's house is collapsing.`.colour(1)); 
                i.house.Collapse()
            }; 
        }
    }

    EventsUpdate() {
        this._eventsIO_Off();

        this.Year();

        console.log();

        if (this.timeout<=0) {
                this._year = this.year;
                this.year = this.lastS;

                console.log(`[Year ${this.year}]`.colour(214));
                console.log("And everybody lived happily ever after. Hopefully.".colour(220));
                for (const h of this.families) {
                    console.log(`The ${h.DName} Family`);
                    for (const f of h.members) {
                        console.log(`- ${f.DName} (${f.age}), a ${f.job.DName}, died of ${f.deathReason}`);

                        /*DEBUG
                        console.log(`${f.PersonalityDice("Eating")}`);
                        console.log(`${f.PersonalityValues.Introvertion} ${f.PersonalityValues.Observance} ${f.PersonalityValues.Thinking} ${f.PersonalityValues.Judging}`);
                        //*/
                    }
                }
                this._eventsIO_Off();
                return;
        }

        if (this.events.length === 0) {
            this.timeout--;
            return this.EventsUpdate();
        } else {
            this.timeout = 2000;
            this.lastS = this.year;
        }

        console.log(`[Year ${this.year}]`.colour(75));

        for (const e of this.events)
            console.log(e);
        this.events = [];

        if (this.year === 1)
            console.log("Press any key to continue to the next year.");

        this._eventsIO_On();
    }

    Init() {
        console.log("[Life Simulator]".colour(214));
        console.log("Written out of boredom by bumet1, mount2010, and various contributors".colour(220));

        console.log();

        console.log("[Loading Modules]".colour(28));
        this.LoadStuffs();
        this.GetNameContent();
        console.log("Done!".colour(76));

        console.log();

        this.NameInfo();

        console.log();

        console.log("[Populating]".colour(63));

        this.year = 0;
        this.events = [];

        this.families = [];
        this.people = [];

        this.events = [];

        this.Populate();

        this.EventsUpdate();

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding("utf8");

        process.stdin.on("data", (key)=>{
            if (key == "\u0003") {
                console.log("[Exit] Thanks for playing!".colour(220));
                process.exit()
            }
            else if (this.eIOOn) this.EventsUpdate();
        });
    }
}

global.Sim = new _Sim();

Sim.Init();
