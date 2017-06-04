/// <reference path="message.ts" />

interface MouseMotionMessageParameters {
    monitorId: MonitorId;
    x, y: number;
}

class MouseMotionMessage extends Message {

    constructor(private params: MouseMotionMessageParameters) {
        super(Control.EventType.MOUSE_MOVE);
    }

    public build(): {} {
        return this.params;
    }
}