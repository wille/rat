/// <reference path="message.ts" />

interface MouseMotionMessageParameters {
    monitorId: MonitorId;
    x, y: number;
}

class MouseMotionMessage extends Message<MouseMotionMessageParameters> {

    constructor(params: MouseMotionMessageParameters) {
        super(Control.EventType.MOUSE_MOVE, params);
    }
}