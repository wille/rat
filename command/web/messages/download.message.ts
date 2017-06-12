/// <reference path="message.ts" />

interface DownloadMessageParameters {
    file: string;
}

class DownloadMessage extends Message<DownloadMessageParameters> {

    /**
     * Request remote file download
     * @param file Path to the remote file to be downloaded
     */
    constructor(file: string) {
        super(Control.EventType.DOWNLOAD, { file: file } as DownloadMessageParameters);
    }
}