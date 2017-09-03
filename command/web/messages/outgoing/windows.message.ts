/// <reference path="outgoingMessage.ts" />

class WindowsMessage extends OutgoingMessage<{}> {

    constructor(params: {}) {
        super(Control.MessageType.WINDOWS, params);
    }
}