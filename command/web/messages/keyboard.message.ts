/// <reference path="message.ts" />

interface KeyMessageParameters {
    keyCode: number;
    state: InputState;
}

class KeyMessage extends Message<KeyMessageParameters> {

    constructor(params: KeyMessageParameters) {
        super(Control.EventType.KEY, params);
    }
}