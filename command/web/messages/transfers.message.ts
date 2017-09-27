/// <reference path="outgoingMessage.ts" />

interface TransfersMessageParameters {
    transfers: Transfer[];
}

class TransfersMessage extends OutgoingMessage<TransfersMessageParameters> {

    /**
     * Send all transfers cached to the server
     * @param transfers
     */
    constructor(transfers: TransfersMessageParameters) {
        super(Control.MessageType.TRANSFERS, transfers);
    }
}