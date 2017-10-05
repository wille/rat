/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    interface TransfersMessageParameters {
        transfers: Transfer[];
    }

    export class TransfersMessage extends OutgoingMessage<TransfersMessageParameters> {

        /**
         * Send all transfers cached to the server
         * @param transfers
         */
        constructor(transfers: TransfersMessageParameters) {
            super(Web.Network.Header.FileTransfers, transfers);
        }
    }
}
