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

class FileMessage extends Message {

    /**
     * Perform task on remote file
     * @param action Copy, move, etc
     * @param file Absolute file path
     * @param destination Absolute destination path. Defaults to empty string
     */
    constructor(private action: FileAction, private file: string, private destination: string = "") {
        super(Control.EventType.FILE);
    }

    public build(): {} {
        return {
            task: this.action,
            file: this.file,
            destination: this.destination
        }
    }
}