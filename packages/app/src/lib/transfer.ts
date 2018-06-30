import { ObjectId } from 'bson';

import { Recipient, TransferData, TransferState } from 'shared/templates';
import TransferController from 'shared/transfer-controller';

export default class Transfer implements TransferController {
  id: ObjectId;
  local?: string;
  remote?: string;
  total: number;
  recv: number;
  recipient: Recipient;
  state: TransferState;

  constructor(data: TransferData) {
    Object.keys(data).forEach(key => (this[key] = data[key]));
  }

  public cancel() {}

  public pause() {}

  public stop() {}

  public start() {}
}
