/// <reference path="message.ts" />

enum ProcessRequestType {
	QUERY = 0,
	KILL = 1
}

interface ProcessMessageParameters {
    type: ProcessRequestType;
    pids?: ProcessId[];
}

class ProcessMessage extends Message<ProcessMessageParameters> {

    constructor(params: ProcessMessageParameters) {
        super(Control.EventType.PROCESS, params);
    }
}