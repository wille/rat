/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    type ProcessId = number;

    export enum ProcessRequestType {
        QUERY = 0,
        KILL = 1
    }

    export interface ProcessMessageParameters {
        type: ProcessRequestType;
        pids?: ProcessId[];
    }

    export class ProcessMessage extends OutgoingMessage<ProcessMessageParameters> {

        constructor(params: ProcessMessageParameters) {
            super(Web.Network.Header.Process, params);
        }
    }
}
