/// <reference path="outgoingMessage.ts" />

class WindowsOutgoingMessage extends OutgoingMessage<any[]> {

    constructor() {
        super(Control.MessageType.WINDOWS, []);
    }
}