/// <reference path="outgoingMessage.ts" />

class TransfersMessage extends OutgoingMessage<Transfer[]> {

    /**
     * Send all transfers cached to the server
     * @param transfers
     */
    constructor(transfers: Transfer[]) {
        super(Control.MessageType.TRANSFERS, transfers);
    }
}