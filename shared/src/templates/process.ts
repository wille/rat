import MessageTemplate from "../templates";

export const enum ProcessType {
    Query,
    Kill
}

export interface Process {
    path: string;
    pid: number;
}

export interface ProcessListTemplate extends MessageTemplate {
    processes: Process[];
}

export interface ProcessTemplate extends MessageTemplate {
    action: ProcessType;
}
