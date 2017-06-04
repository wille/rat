/// <reference path="message.ts" />

enum TerminalAction {
    START = 0,
    STOP = 1,
    WRITE = 2
}

class TerminalMessage extends Message {

    /**
     * Remote Shell
     * @param action Action to perform, such as start shell, kill shell, write command
     * @param command Command string, may be empty
     */
    constructor(private action: TerminalAction, private command: string = "") {
        super(Control.EventType.TERMINAL);
    }

    public build(): {} {
        return {
            action: this.action,
            command: this.command
        }
    }

}