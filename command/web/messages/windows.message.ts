/// <reference path="outgoingMessage.ts" />

class WindowsOutgoingMessage extends OutgoingMessage<{}> {

    constructor() {
        super(Control.MessageType.WINDOWS, {});
    }
}