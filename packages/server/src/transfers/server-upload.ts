import { ObjectID } from 'bson';
import { transfersList } from 'server/src/transfers/download-to-server';
import ServerTransferController from 'server/src/transfers/server-transfer-controller';
import { Recipient, TransferState } from 'shared/templates';

class ServerUpload extends ServerTransferController {
  constructor(id = new ObjectID()) {
    super(id, Recipient.Client);
  }
  public pause() {}

  public start() {}

  public passthrough(data: Buffer) {
    this.recv += data.length;
    this.counter += data.length;
    this.state = TransferState.InProgress;
    this.update();
  }

  public cancel() {}
}

export function createUpload(id: ObjectID = new ObjectID()): ServerUpload {
  const existing = transfersList.find(
    x => x.id && x.id.equals(id) && x.recipient === Recipient.Client
  );
  if (existing) {
    return existing as ServerUpload;
  }

  const transfer = new ServerUpload(id);
  transfersList.push(transfer);
  transfer.start();
  return transfer;
}
