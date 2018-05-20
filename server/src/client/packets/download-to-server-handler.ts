import Client from '~/client/client';
import ControlSocketServer from '~/control-socket';
import { createTransfer } from '~/transfers';
import { TransferMessage } from '~/ws/messages';

import { DataTemplate } from '../../../../shared/src/templates';

export default (data: DataTemplate, _, client: Client) => {
  const transfer = createTransfer(data.id);
  transfer.total = data.total;

  transfer.write(data.data.buffer);

  if (data.final) {
    transfer.close();
  }

  console.log(transfer);
  ControlSocketServer.broadcast(new TransferMessage(transfer));
};
