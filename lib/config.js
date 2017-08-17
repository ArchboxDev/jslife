class _Value {
    constructor(raw) {
        this.raw = raw;
    }

    is(q) {
        return this.raw === q;
    }

    isAny(q) {
        return this.raw == q;
    }

    isType(q) {
        return typeof this.raw === q;
    }

    get Bool() {
        return this.isType("boolean");
    }

    get String() {
        return this.isType("string");
    }

    get Number() {
        return this.isType("number");
    }

    get Integer() {
        return this.Number;
    }

    get Int() {
        return this.Number;
    }

    get Undefined() {
        return this.isType("undefined");
    }

    get Null() {
        return this.isAny(null);
    }
}

class _ObjValue {
    constructor(raw) {
        this.raw = raw;
        this.entries = {};

        for (const ind in this.raw) {
            const val = this.raw[ind];

            if (typeof val === "object") {
                this.entries[ind] = new _ObjValue(val);
            } else {
                this.entries[ind] = new _Value(val);
            }
        }
    }

    get(index) {
        return this.entries[index];
    }

    hasKey(q) {
        return this.keys.includes(q);
    }

    hasValue(q) {
        return this.values.includes(q);
    }

    get has() {
        return this.hasKey;
    }

    get keys() {
        return Object.keys(this.raw);
    }

    get values() {
        return Object.values(this.raw);
    }

    get size() {
        return this.keys.length;
    }

    get count() {
        return this.size;
    }

    get length() {
        return this.size;
    }
}

class _Config {
    constructor(file) {
        this.file = file;
        this.raw = require(this.file);
        
        this.cfg = new _ObjValue(this.raw);
    }

    reload() {
        RUtil.reloadFiltered(this.file);
    }
}

const Configuration = new _Config("../cfg.json");

global.config = Configuration.cfg;

config.__Configuration = Configuration;

// Init //

for (const mod in config.get("Globals").entries) {
    console.log(`Loading Global: "${mod}"`);
    try {
        const f = config.get("Globals").get(mod).raw;
        global[mod] = require(f);
    } catch(e) {
        console.log(`Error occured requiring ${mod}:`);
        console.log(e);
    }
}

for (const mod in config.get("Modules").entries) {
    console.log(`Loading Module: "${mod}"`);

    let f = config.get("Modules").get(mod).raw;

    function _Checks() {
        let v = true;
        try {
            require.resolve(f);
        } catch(e) {
            v = false;
        }

        if (v)
            return v;

        if (f.startsWith("./")) {
            f = `.${f}`;
            return _Checks();
        }
        return false;
    }

    if (_Checks())
        try {
            require(f);
        } catch(e) {
            console.log(`Error occured requiring ${mod}:`);
            console.log(e);
        }
}