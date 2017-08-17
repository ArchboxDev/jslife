class _Relation {
    constructor(P1, P2, Friendship = 0, Passion = 0, Relation = []) {
        this.P1 = P1;
        this.P2 = P2;

        this.Friendship = Friendship;
        this.Passion = Passion;

        this.Relation = Relation;

        this.Compatibility = 0;

        this.Init();
    }

    Init() {
        if (!this.FamilyRelated && this.Hetero) {
            this.Compatibility = Math.floor(Math.random()*100-(this.P1.age-this.P2.age));
            this.Friendship = this.Friendship+Math.floor(this.Compatibility/3);
        } else
            this.Compatibility = -100;
    }

    get Hetero() {
        return (this.P1.gender && !this.P2.gender) || (!this.P1.gender && this.P2.gender);
    }

    get FamilyRelated() {
        const S = ["Brother", "Sister", "Parent", "Child"];
        let r = false;
        for (const s of S)
            if (this.Relation.includes(s))
                r = true;
        return r;
    }
}

Sim.Relation = _Relation;