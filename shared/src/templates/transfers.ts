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
}

export interface DataTemplate extends MessageTemplate {
  file: string;
  total: number;
  final: boolean;
  data: any;
}

export interface TransferData {
  _id: ObjectId;
  local?: string;
  remote?: string;
  total: number;
  recv: number;
  state: TransferState;
}

export interface TransferListTemplate extends MessageTemplate {
  transfer: TransferData;
}
