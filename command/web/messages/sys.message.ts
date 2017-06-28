const enum SysAction {
    // Kill the connection and process
    DISCONNECT,

    // Shutdown the machine
    SHUTDOWN,

    // Reboot the machine
    REBOOT
}

class SysMessage extends Message<SysAction> {

    constructor(action: SysAction) {
        super(Control.EventType.SYS, action);
    }
}