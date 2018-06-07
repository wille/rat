import MessageTemplate from "./template";
import { ObjectId } from 'bson';

export enum TransferState {
  InProgress,

  // paused
  Paused,

  // cancelled while in transfer
  Cancelled,

  // completed but later deleted from disk
  Deleted,

  // first data not received
  Waiting,

  Complete,
}

export enum Recipient {
  Client,
  Server
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
}

export type TransferTemplate = TransferData;
