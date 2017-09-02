/// <reference path="outgoingMessage.ts" />

interface KeyMessageParameters {
    keyCode: number;
    state: InputState;
}

class KeyMessage extends OutgoingMessage<KeyMessageParameters> {

    constructor(params: KeyMessageParameters) {
        super(Control.EventType.KEY, params);
    }
}