import MessageTemplate from './template';

export const enum ProcessType {
  Query,
  Kill,
}

export interface Process {
  path: string;
  pid: number;
}

export type ProcessListTemplate = Process[];

export interface ProcessTemplate extends MessageTemplate {
  action: ProcessType;
}
