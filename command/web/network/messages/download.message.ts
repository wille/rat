/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    interface DownloadMessageParameters {
        file: string;
    }

    export class DownloadMessage extends OutgoingMessage<DownloadMessageParameters> {

        /**
         * Request remote file download
         * @param file Path to the remote file to be downloaded
         */
        constructor(file: string) {
            super(Web.Network.Header.Download, { file: file } as DownloadMessageParameters);
        }
    }
}
