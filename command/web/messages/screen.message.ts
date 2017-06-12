/// <reference path="message.ts" />

interface ScreenMessageParameters {
    active: boolean;
    scale?: number;
    monitor?: number;
}

class ScreenMessage extends Message<ScreenMessageParameters> {

    constructor(params: ScreenMessageParameters) {
        super(Control.EventType.SCREEN, params);
    }
}