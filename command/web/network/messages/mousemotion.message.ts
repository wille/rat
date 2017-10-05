/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    import MonitorId = Desktop.MonitorId;

    export interface MouseMotionMessageParameters {
        monitorId: MonitorId;
        x, y: number;
    }
    
    export class MouseMotionMessage extends OutgoingMessage<MouseMotionMessageParameters> {
    
        constructor(params: MouseMotionMessageParameters) {
            super(Web.Network.Header.MouseMove, params);
        }
    }
}
