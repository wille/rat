/// <reference path="outgoingMessage.ts" />

class WindowsOutgoingMessage extends OutgoingMessage<{}> {

    constructor(params: {}) {
        super(Control.MessageType.WINDOWS, params);
    }
}