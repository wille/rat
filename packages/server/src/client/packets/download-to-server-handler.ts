import Client from '../../client/client';
import { createTransfer } from '../../transfers';

import { DataTemplate, TransferState } from 'shared/templates';

export default (data: DataTemplate, _, client: Client) => {
  const transfer = createTransfer(data.id);

  transfer.remote = data.file;
  transfer.total = data.total;

  transfer.state = TransferState.InProgress;
  transfer.write(data.data.buffer);

  if (data.final) {
    transfer.finish();
  }
};
