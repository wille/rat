const enum SysAction {
    // Kill the connection and process
    DISCONNECT,

    // Shutdown the machine
    SHUTDOWN,

    // Reboot the machine
    REBOOT
}

interface SysMessageParameters {
    action: SysAction;
}

class SysMessage extends OutgoingMessage<SysMessageParameters> {

    constructor(action: SysMessageParameters) {
        super(Control.MessageType.SYS, action);
    }
}