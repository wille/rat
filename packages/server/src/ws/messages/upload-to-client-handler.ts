import debug from 'debug';
import Client from 'server/src/client/client';
import { UploadPacket } from 'server/src/client/packets';
import { createUpload } from 'server/src/transfers/server-upload';
import { UploadTemplate } from 'shared/templates';

const log = debug('server:transfer');

export default (data: UploadTemplate, _, client: Client) => {
  const transfer = createUpload(data.id);

  if (data.file) {
    transfer.remote = data.file;
    transfer.local = data.local;
    transfer.total = data.total;
  }

  if (data.data) {
    transfer.passthrough(data.data);
  }

  if (data.final) {
    transfer.finish();
  }

  const packet = {
    file: data.file,
    data: data.data,
    total: transfer.total,
    final: data.final,
  };

  if (!data.data) {
    delete packet.data;
  }

  client.send(new UploadPacket(packet));
};
