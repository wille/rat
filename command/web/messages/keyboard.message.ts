/// <reference path="message.ts" />

interface KeyMessageParameters {
    keyCode: number;
    state: InputState;
}

class KeyMessage extends Message {

    constructor(private params: KeyMessageParameters) {
        super(Control.EventType.KEY);
    }

    public build(): {} {
        return this.params;
    }
}