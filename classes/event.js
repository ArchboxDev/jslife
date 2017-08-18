class _Event {
    constructor(message = "", meta = {}) {
        this.message = message;
        this.meta = meta;

        Sim.events.push(this);
    }
}

Sim.Event = _Event;