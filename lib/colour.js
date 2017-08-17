Object.defineProperty(String.prototype, "colour", {
    get: function(){ return (c)=>{
        return "\033[38;5;"+c+"m"+this.toString()+"\033[0m";
    }}
});

Object.defineProperty(String.prototype, "bgColour", {
    get: function(){ return (c)=>{
        return "\033[48;5;"+c+"m"+this.toString()+"\033[0m";
    }}
});