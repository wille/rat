import { UploadToClientMessage } from 'app/src/messages';
import * as path from 'path';
import Client from '../client';

async function upload(file: File, baseDir: string, client: Client) {
  const reader = new FileReader();
  const b = 0;

  const filePath = path.join(baseDir, file.name);

  reader.onprogress = e => {
    const data = reader.result as ArrayBuffer;

    client.send(
      new UploadToClientMessage({
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
        file: filePath,
        total: file.size,
        final: true,
        data: null,
      })
    );

  reader.readAsArrayBuffer(file);
}

export function requestFile(client: Client, baseDir: string) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('name', 'file');
  input.setAttribute('multiple', 'multiple');
  input.setAttribute('enctype', 'multipart/form-data');
  input.onchange = e => {
    e.preventDefault();

    for (let i = 0; i < input.files.length; i++) {
      upload(input.files[i], baseDir, client);
    }
  };
  input.click();
}
