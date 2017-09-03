const enum SysAction {
    // Kill the connection and process
    DISCONNECT,

    // Shutdown the machine
    SHUTDOWN,

    // Reboot the machine
    REBOOT
}

class SysMessage extends OutgoingMessage<SysAction> {

    constructor(action: SysAction) {
        super(Control.MessageType.SYS, action);
    }
}