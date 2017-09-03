/// <reference path="outgoingMessage.ts" />

interface DirectoryMessageParameters {
    path: string;
}

class DirectoryMessage extends OutgoingMessage<DirectoryMessageParameters> {

    /**
     * Browse remote file system
     * @param path Absolute path to the remote directory
     */
    constructor(path: string) {
        super(Control.MessageType.DIRECTORY, { path: path } as DirectoryMessageParameters);
    }
}