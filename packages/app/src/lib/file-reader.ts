import { UploadToClientMessage } from 'app/src/messages';
import { ObjectId } from 'bson';
import * as path from 'path';
import { file } from 'tmp';
import Client from '../client';

async function upload(
  id: ObjectId,
  file: File,
  baseDir: string,
  client: Client
) {
  const reader = new FileReader();
  const b = 0;

  const filePath = path.join(baseDir, file.name);

  reader.onprogress = e => {
    const data = reader.result as ArrayBuffer;

    client.send(
      new UploadToClientMessage({
        id,
        file: filePath,
        total: file.size,
        final: false,
        data: new Buffer(data.slice(b)),
      })
    );
  };

  reader.onloadend = () =>
    client.send(
      new UploadToClientMessage({
        id,
        file: filePath,
        total: file.size,
        final: true,
        data: null,
      })
    );

  reader.readAsArrayBuffer(file);
}

export function requestFile(
  client: Client,
  baseDir: string,
  onFile: (id: ObjectId, name: string) => void
) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('name', 'file');
  input.setAttribute('multiple', 'multiple');
  input.setAttribute('enctype', 'multipart/form-data');
  input.onchange = e => {
    e.preventDefault();

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const id = new ObjectId();
      upload(id, file, baseDir, client);
      onFile(id, file.name);
    }
  };
  input.click();
}
