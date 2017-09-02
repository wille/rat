/// <reference path="outgoingMessage.ts" />

enum ProcessRequestType {
	QUERY = 0,
	KILL = 1
}

interface ProcessMessageParameters {
    type: ProcessRequestType;
    pids?: ProcessId[];
}

class ProcessMessage extends OutgoingMessage<ProcessMessageParameters> {

    constructor(params: ProcessMessageParameters) {
        super(Control.EventType.PROCESS, params);
    }
}