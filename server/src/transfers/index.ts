import { ObjectId, ObjectID } from 'bson';
import * as fs from 'fs';
import * as tmp from 'tmp';
import {
  Recipient,
  TransferData,
  TransferState,
} from '../../../shared/src/templates';

const debug = require('debug')('server:transfer');

export const transfersList: TransferData[] = [];

class Transfer implements TransferData {
  public local: string;
  public remote: string;
  public total: number = 0;
  public recv: number = 0;
  public state: TransferState = TransferState.Waiting;
  public recipient: Recipient;

  private fd: number;

  constructor(readonly id: ObjectId) {}

  public open() {
    const tempFile = tmp.fileSync();
    debug('writing', this.remote, 'to', tempFile.name);
    this.local = tempFile.name;
    this.fd = tempFile.fd;
  }

  public write(data: Buffer) {
    this.recv += data.length;
    fs.writeFileSync(this.fd, data);
  }

  public close() {
    this.state = TransferState.Complete;
    fs.closeSync(this.fd);
    this.fd = null;
  }
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
