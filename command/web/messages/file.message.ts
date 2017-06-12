/// <reference path="message.ts" />

enum FileAction {
	// Touch file
	TOUCH = 0,

	// Unlink file
	UNLINK = 1,

	// Move file
	MOVE = 2,

	// Copy file
	COPY = 3
}

interface FileMessageParameters {
    action: FileAction;
    file: string;
    destination?: string;
}

class FileMessage extends Message<FileMessageParameters> {

    constructor(params: FileMessageParameters) {
        super(Control.EventType.FILE, params);
    }
}