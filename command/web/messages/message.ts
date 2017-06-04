abstract class Message {

    /**
     * Outgoing websocket message
     * @param header The message numeric header
     */
    constructor(public readonly header: Control.EventType) {

    }

    abstract build(): {};

    public static stringify(msg: Message): string {
        return JSON.stringify(msg.build());
    }
}