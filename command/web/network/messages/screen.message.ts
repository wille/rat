/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    export interface IScreenMessageParameters {
        active: boolean;
        scale?: number;

        // Whole monitor or just a window?
        monitor?: boolean;

        // Monitor/window handle
        handle?: number;
    }

    export class ScreenMessage extends OutgoingMessage<IScreenMessageParameters> {

        constructor(params: IScreenMessageParameters) {
            super(Web.Network.Header.Screen, params);
        }
    }
}
