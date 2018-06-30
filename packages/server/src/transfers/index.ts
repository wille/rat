import { ObjectId, ObjectID } from 'bson';
import * as fs from 'fs';
import * as throttle from 'lodash.throttle';
import * as tmp from 'tmp';

import { Recipient, TransferData, TransferState } from 'shared/templates';
import TransferController from 'shared/transfer-controller';
import ControlSocketServer from '../control-socket';
import { TransferMessage } from '../ws/messages';

const debug = require('debug')('server:transfer');

export const transfersList: TransferData[] = [];

class Transfer implements TransferController {
  public local: string;
  public remote: string;
  public total: number = 0;
  public recv: number = 0;
  public state: TransferState = TransferState.Waiting;
  public recipient: Recipient;

  public readonly update = throttle(
    () => ControlSocketServer.broadcast(new TransferMessage(this)),
    1000
  );

  private fd: number;

  constructor(readonly id: ObjectId = new ObjectId()) {}

  public open() {
    const tempFile = tmp.fileSync();
    debug('writing', this.remote, 'to', tempFile.name);
    this.local = tempFile.name;
    this.fd = tempFile.fd;

    this.update();
  }

  public write(data: Buffer) {
    this.recv += data.length;
    this.state = TransferState.InProgress;
    this.update();

    fs.writeFileSync(this.fd, data);
  }

  public close() {
    this.state = TransferState.Complete;
    this.update();

    fs.closeSync(this.fd);
    this.fd = null;
  }

  public cancel() {}

  public start() {}

  public pause() {}
}

export function createTransfer(id: ObjectID): Transfer {
  const existing = transfersList.find(x => x.id.equals(id));
  if (existing) {
    return existing as Transfer;
  }

  const transfer = new Transfer(id);
  transfersList.push(transfer);

  transfer.open();

  return transfer;
}
