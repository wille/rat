/// <reference path="outgoingMessage.ts" />

const enum WindowAction {
    RELOAD,
    SHOW,
    MINIMIZE
}

interface WindowsMessageParameters {
    action: WindowAction;
    frames?: Frame[];
}

class WindowsOutgoingMessage extends OutgoingMessage<WindowsMessageParameters> {

    constructor(params: WindowsMessageParameters) {
        super(Control.MessageType.WINDOWS, params);
    }
}