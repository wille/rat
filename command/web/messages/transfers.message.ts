/// <reference path="message.ts" />

class TransfersMessage extends Message {

    /**
     * Send all transfers cached to the server
     * @param s JSON string of TRANSFERS object (TODO)
     */
    constructor(private s: any) {
        super(Control.EventType.TRANSFERS);
    }

    public build(): {} {
        return this.s;
    }
}