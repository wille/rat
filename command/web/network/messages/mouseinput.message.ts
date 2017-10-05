/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    import MonitorId = Desktop.MonitorId;

    export interface MouseInputMessageParameters {
        monitorId: MonitorId;
        button: MouseButton;
        state: InputState;
    }

    export class MouseInputMessage extends OutgoingMessage<MouseInputMessageParameters> {

        constructor(params: MouseInputMessageParameters) {
            super(Web.Network.Header.MouseMove, params);
        }
    }
}