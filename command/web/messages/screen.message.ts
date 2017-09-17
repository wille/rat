/// <reference path="outgoingMessage.ts" />

interface ScreenMessageParameters {
    active: boolean;
    scale?: number;

    // Whole monitor or just a window?
    monitor?: boolean;

    // Monitor/window handle
    handle?: number;
}

class ScreenMessage extends OutgoingMessage<ScreenMessageParameters> {

    constructor(params: ScreenMessageParameters) {
        super(Control.MessageType.SCREEN, params);
    }
}