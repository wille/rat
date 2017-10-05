namespace Web.Network.Messages {

    export abstract class OutgoingMessage<T> {

        /**
         * Outgoing websocket message
         * @param header The message numeric header
         * @param params The message parameters
         */
        constructor(public readonly header: Web.Network.Header, public readonly params: T) {

        }
    }
}
