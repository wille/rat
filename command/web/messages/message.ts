abstract class Message<T> {

    /**
     * Outgoing websocket message
     * @param header The message numeric header
     * @param params The message parameters
     */
    constructor(public readonly header: Control.EventType, public readonly params: T) {

    }

    public static stringify(msg: Message<any>): string {
        return JSON.stringify(msg.params);
    }
}