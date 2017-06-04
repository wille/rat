/// <reference path="message.ts" />

interface MouseInputMessageParameters {
    monitorId: MonitorId;
    button: MouseButton;
    state: InputState;
}

class MouseInputMessage extends Message {

    constructor(private params: MouseInputMessageParameters) {
        super(Control.EventType.MOUSE_MOVE);
    }

    public build(): {} {
        return this.params;
    }
}