/// <reference path="message.ts" />

interface MouseInputMessageParameters {
    monitorId: MonitorId;
    button: MouseButton;
    state: InputState;
}

class MouseInputMessage extends Message<MouseInputMessageParameters> {

    constructor(params: MouseInputMessageParameters) {
        super(Control.EventType.MOUSE_MOVE, params);
    }
}