/// <reference path="message.ts" />

class DownloadMessage extends Message {

    /**
     * Request remote file download
     * @param file Path to the remote file to be downloaded
     */
    constructor(private file: string) {
        super(Control.EventType.DOWNLOAD);
    }

    public build(): {} {
        return {
            file: this.file
        }
    }
}