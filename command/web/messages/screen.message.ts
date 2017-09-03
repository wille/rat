/// <reference path="outgoingMessage.ts" />

interface ScreenMessageParameters {
    active: boolean;
    scale?: number;
    monitor?: number;
}

class ScreenMessage extends OutgoingMessage<ScreenMessageParameters> {

    constructor(params: ScreenMessageParameters) {
        super(Control.MessageType.SCREEN, params);
    }
}