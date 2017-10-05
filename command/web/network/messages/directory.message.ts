/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    interface DirectoryMessageParameters {
        path: string;
    }

    export class DirectoryMessage extends OutgoingMessage<DirectoryMessageParameters> {

        /**
         * Browse remote file system
         * @param path Absolute path to the remote directory
         */
        constructor(path: string) {
            super(Web.Network.Header.Directory, { path: path } as DirectoryMessageParameters);
        }
    }
}
