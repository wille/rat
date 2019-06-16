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

  Error,
}

export interface Transfer {
  id: string;

  local?: string;
  remote?: string;
  download: boolean;

  offset: number;
  len: number;
  state: TransferState;
  bps?: number;
}
