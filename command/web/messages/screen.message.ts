/// <reference path="message.ts" />

interface ScreenMessageParameters {
    active: boolean;
    scale?: number;
    monitor?: number;
}

class ScreenMessage extends Message {

    /**
     * Start or stop remote screen
     * @param active Start or stop
     * @param scale Scale between 0.0 - 1.0
     * @param monitor Monitor ID
     */
    constructor(private params: ScreenMessageParameters) {
        super(Control.EventType.SCREEN);
    }

    public build(): {} {
        return this.params;
    }
}