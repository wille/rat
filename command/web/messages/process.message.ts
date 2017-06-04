/// <reference path="message.ts" />

enum ProcessRequestType {
	QUERY = 0,
	KILL = 1
}

interface ProcessMessageParameters {
    type: ProcessRequestType;
    pids?: ProcessId[];
}

class ProcessMessage extends Message {

    constructor(private params: ProcessMessageParameters) {
        super(Control.EventType.PROCESS);
    }

    public build(): {} {
        return this.params;
    }
}