/// <reference path="message.ts" />

class TransfersMessage extends Message<Transfer[]> {

    /**
     * Send all transfers cached to the server
     * @param transfers
     */
    constructor(transfers: Transfer[]) {
        super(Control.EventType.TRANSFERS, transfers);
    }
}