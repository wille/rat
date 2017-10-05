/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    export const enum SysAction {
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

    export class SysMessage extends OutgoingMessage<SysMessageParameters> {

        constructor(action: SysMessageParameters) {
            super(Web.Network.Header.System, action);
        }
    }
}
