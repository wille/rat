import { TransferState } from 'shared/templates';

export function getProgressColor(state: TransferState) {
  switch (state) {
    case TransferState.InProgress:
      return 'green';
    case TransferState.Cancelled:
      return 'red';
    case TransferState.Paused:
      return 'yellow';
    default:
      return 'transparent';
  }
}
