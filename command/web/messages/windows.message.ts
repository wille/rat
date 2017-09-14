/// <reference path="outgoingMessage.ts" />

const enum WindowAction {
    // Reload all windows
    RELOAD,

    // Show the window (restore from minimize state on Windows etc)
    SHOW,

    // Minimize/Hide, hide to taskbar on Windows etc
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