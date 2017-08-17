// Name : Base Pay //
Sim.Jobs = {
    "Athlete" : 240,
    "Cashier" : 100,
    "Chef"    : 200,
    "Criminal": 180,
    "Dentist" : 225,
    "Guard"   : 190,
    "Lawyer"  : 250,
    "Painter" : 150,
    "Pilot"   : 190,
    "Police"  : 230,
    "Teacher" : 245,
    "Vet"     : 170,
    "Writer"  : 150,
    "_Invalid": 0
}
Sim.JobsN = Object.keys(Sim.Jobs);

Sim.JobPersoMatches = {
    "Athlete" : "Energy",
    "Cashier" : "Mind",
    "Chef"    : "Nature",
    "Criminal": "Mind",
    "Dentist" : "Nature",
    "Guard"   : "Tactics",
    "Lawyer"  : "Tactics",
    "Painter" : "Mind",
    "Pilot"   : "Mind",
    "Police"  : "Tactics",
    "Teacher" : "Mind",
    "Vet"     : "Nature",
    "Writer"  : "Nature"
}

class _Job {
    constructor(employee, job, level = 1, exp = 0) {
        this.employee = employee;

        if (!job)
            job = Sim.JobsN[Math.floor(Math.random()*(Sim.JobsN.length-1))];
        this.job = job;

        this.level = level;
        this.exp = exp;
    }

    get DName() {
        return `Level ${this.level} ${this.job}`.colour(77);
    }

    get Pay() {
        const base = Sim.Jobs[this.job]||Sim.Jobs._Invalid;
        return base*2*(this.level/2);
    }

    LevelUp() {
        this.level++;
        this.exp = 0;

        Sim.events.push(`${this.employee.DName} has been promoted to a ${this.DName}.`);
    }

    AddExp(amn) {
        this.exp += amn;
        if (this.exp >= 300)
            this.LevelUp();
    }

    Yearly() {
        // Todo: Change based on motivation and skills/traits //
        this.AddExp(Math.floor(Math.random()*Math.floor(Sim.Roll()?150:Sim.Roll()?50:25/2/(10/2))));
        
        this.employee.Pay(this.Pay);
    }
}

Sim.Job = _Job;
