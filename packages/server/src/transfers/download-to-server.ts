import { ObjectID, ObjectId } from 'bson';
import * as fs from 'fs';
import ServerTransferController from 'server/src/transfers/server-transfer-controller';
import { Recipient, TransferState } from 'shared/templates';
import * as tmp from 'tmp';

const debug = require('debug')('server:transfer');

export const transfersList: ServerTransferController[] = [];

class ServerDownloadTransfer extends ServerTransferController {
  private fd: number;

  constructor(id = new ObjectId()) {
    super(id, Recipient.Server);
  }

  public write(data: Buffer) {
    this.recv += data.length;
    this.counter += data.length;
    this.state = TransferState.InProgress;
    this.update();

    fs.writeFileSync(this.fd, data);
  }

  public finish() {
    try {
      fs.closeSync(this.fd);
    } catch (e) {
      debug('failed to finish()', e);
    }
    this.fd = null;
    super.finish();
  }

  public cancel() {}

  public start() {
    const tempFile = tmp.fileSync();
    debug('writing', this.remote, 'to', tempFile.name);
    this.local = tempFile.name;
    this.fd = tempFile.fd;

    this.update();
  }

  public pause() {}
}

export function createTransfer(id: ObjectID): ServerDownloadTransfer {
  const existing = transfersList.find(x => x.id.equals(id));
  if (existing) {
    return existing as ServerDownloadTransfer;
  }

  const transfer = new ServerDownloadTransfer(id);
  transfersList.push(transfer);

  transfer.start();

  return transfer;
}
