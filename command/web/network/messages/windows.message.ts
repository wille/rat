/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    import OutgoingMessage = Messages.OutgoingMessage;
    import Frame = Desktop.Frame;

    export const enum WindowAction {
        // Reload all windows
        RELOAD,

        // Show the window (restore from minimize state on Windows etc)
        SHOW,

        // Minimize/Hide, hide to taskbar on Windows etc
        MINIMIZE
    }

    export interface WindowsMessageParameters {
        action: WindowAction;
        frames?: Frame[];
    }

    export class WindowsOutgoingMessage extends OutgoingMessage<WindowsMessageParameters> {

        constructor(params: WindowsMessageParameters) {
            super(Web.Network.Header.Windows, params);
        }
    }
}