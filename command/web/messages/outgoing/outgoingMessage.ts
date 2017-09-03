abstract class OutgoingMessage<T> {

    /**
     * Outgoing websocket message
     * @param header The message numeric header
     * @param params The message parameters
     */
    constructor(public readonly header: Control.MessageType, public readonly params: T) {

    }
}