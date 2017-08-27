/// <reference path="message.ts" />

class WindowsMessage extends Message<{}> {

    constructor(params: {}) {
        super(Control.EventType.WINDOWS, params);
    }
}