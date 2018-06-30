import debug from 'debug';

import { TransferAction, TransferActionTemplate } from 'shared/templates';

import { BrowsePacket } from '../../client/packets';
import { transfersList } from '../../transfers';

const log = debug('server:transfer');

export default (data: TransferActionTemplate) => {
  log(data.action, data.id);
  const transfer = transfersList.find(t => t.id.equals(data.id));

  if (transfer) {
    switch (data.action) {
      case TransferAction.PAUSE:
        transfer.pause();
        break;
      case TransferAction.RESUME:
        transfer.start();
        break;
      case TransferAction.CANCEL:
        transfer.cancel();
        break;
      default:
        break;
    }
  } else {
    throw new Error('failed to find transfer ' + data.id.toHexString());
  }
};
