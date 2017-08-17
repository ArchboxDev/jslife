const fs = require("fs");

const file = "./lastnames";

function Write() {
    const c = ParseFile();
    fs.writeFileSync(file, c);
}

function ParseFile() {
    const cr = fs.readFileSync(file, "utf8");
    let c = JSON.parse(cr).ToParse;

    const cc = {};
    c = c.filter((v)=>{
        const e = c.filter(d=>d==v).length;
        if (cc[v])
            cc[v]++
        else
            cc[v] = 1;
        return cc[v] === e;
    });

    c.sort((a,b)=>a>b?1:-1);

    return c.join("\n");
}

function WriteToJSON() {
    const c = ParseToJSON();
    fs.writeFileSync(file, c);
}

function ParseToJSON() {
    const cr = fs.readFileSync(file, "utf8");
    const c = cr.split("\n");

    const r = {ToParse:[]};
    r.ToParse = c;

    return JSON.stringify(r);
}

Write();