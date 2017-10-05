/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    export enum TerminalAction {
        START = 0,
        STOP = 1,
        WRITE = 2
    }

    interface TerminalMessageParameters {
        action: TerminalAction;
        command?: string;
    }

    export class TerminalMessage extends OutgoingMessage<TerminalMessageParameters> {

        /**
         * Remote Shell
         * @param action Action to perform, such as start shell, kill shell, write command
         * @param command Command string, may be empty
         */
        constructor(action: TerminalAction, command: string = "") {
            super(Web.Network.Header.Shell, { action: action, command: command } as TerminalMessageParameters);
        }
    }
}
