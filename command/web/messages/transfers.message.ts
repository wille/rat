/// <reference path="message.ts" />

class TransfersMessage extends Message<any> {

    /**
     * Send all transfers cached to the server
     * @param s JSON string of TRANSFERS object (TODO)
     */
    constructor(s: any) {
        super(Control.EventType.TRANSFERS, s);
    }
}