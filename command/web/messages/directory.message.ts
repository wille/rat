/// <reference path="message.ts" />

interface DirectoryMessageParameters {
    path: string;
}

class DirectoryMessage extends Message<DirectoryMessageParameters> {

    /**
     * Browse remote file system
     * @param path Absolute path to the remote directory
     */
    constructor(path: string) {
        super(Control.EventType.DIRECTORY, { path: path } as DirectoryMessageParameters);
    }
}