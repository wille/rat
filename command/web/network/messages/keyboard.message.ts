/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    import MessageType = Network.Header;
    
    export interface KeyMessageParameters {
        keyCode: number;
        state: InputState;
    }
    
    export class KeyMessage extends OutgoingMessage<KeyMessageParameters> {
    
        constructor(params: KeyMessageParameters) {
            super(MessageType.Key, params);
        }
    }
}
