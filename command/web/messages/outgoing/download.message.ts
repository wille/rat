/// <reference path="outgoingMessage.ts" />

interface DownloadMessageParameters {
    file: string;
}

class DownloadMessage extends OutgoingMessage<DownloadMessageParameters> {

    /**
     * Request remote file download
     * @param file Path to the remote file to be downloaded
     */
    constructor(file: string) {
        super(Control.MessageType.DOWNLOAD, { file: file } as DownloadMessageParameters);
    }
}