import MessageTemplate from "./template";
import { ObjectId } from 'bson';

export enum TransferState {
  // is uploading
  Uploading,

  // is downloading
  Downloading,

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
  state: TransferState;
}

export type TransferTemplate = TransferData;
