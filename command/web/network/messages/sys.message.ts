/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    export const enum SysAction {
        // Kill the connection and process
        Disconnect,

        // Shutdown the machine
        Shutdown,

        // Reboot the machine
        Reboot,

        Uninstall
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
