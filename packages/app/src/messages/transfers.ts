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

export interface Transfer {
  id?: string;

  local?: string;
  remote?: string;
  download: boolean;

  offset: number;
  len: number;
  state: TransferState;
  bps?: number;
}
