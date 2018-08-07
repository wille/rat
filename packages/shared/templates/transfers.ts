import { ObjectId } from 'bson';
import MessageTemplate from './template';

export enum TransferState {
  InProgress = 'In progress',

  // paused
  Paused = 'Paused',

  // cancelled while in transfer
  Cancelled = 'Cancelled',

  // completed but later deleted from disk
  Deleted = 'Deleted',

  // first data not received
  Waiting = 'Waiting',

  Complete = 'Complete',
}

export enum Recipient {
  Client,
  Server,
}

export interface DataTemplate extends MessageTemplate {
  file: string;
  total: number;
  final: boolean;
  data: any;
}

export interface RequestDownloadTemplate extends MessageTemplate {
  id: ObjectId;
  file: string;
}

export interface TransferData {
  id: ObjectId;
  local?: string;
  remote?: string;
  total: number;
  recv: number;
  recipient: Recipient;
  state: TransferState;
  bps?: number;
}

export type TransferTemplate = TransferData;

export enum TransferAction {
  PAUSE = 'pause',
  RESUME = 'start',
  CANCEL = 'cancel',
}

export interface TransferActionTemplate extends MessageTemplate {
  id: ObjectId;
  action: TransferAction;
}

export interface UploadTemplate extends DataTemplate {
  local?: string;
}
