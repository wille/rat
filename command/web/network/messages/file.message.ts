/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    export enum FileAction {
        // Touch file
        TOUCH = 0,

        // Unlink file
        UNLINK = 1,

        // Move file
        MOVE = 2,

        // Copy file
        COPY = 3
    }

    export interface FileMessageParameters {
        action: FileAction;
        file: string;
        destination?: string;
    }

    export class FileMessage extends OutgoingMessage<FileMessageParameters> {

        constructor(params: FileMessageParameters) {
            super(Web.Network.Header.File, params);
        }
    }
}
