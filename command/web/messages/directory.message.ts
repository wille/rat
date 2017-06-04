/// <reference path="message.ts" />

class DirectoryMessage extends Message {

    /**
     * Browse remote file system
     * @param path Absolute path to the remote directory
     */
    constructor(private path: string) {
        super(Control.EventType.DIRECTORY);
    }

    public build(): {} {
        return {
            path: this.path
        }
    }
}