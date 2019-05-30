import Client from '../client';
import { UploadMessage } from '../messages/directory';

async function upload(client: Client, file: File, remoteDestination: string) {
  const reader = new FileReader();
  let b = 0;

  client.send(
    new UploadMessage({
      name: file.name,
      dest: remoteDestination,
      size: file.size,
    })
  );

  reader.onprogress = e => {
    const data = reader.result as ArrayBuffer;

    console.log(data, JSON.stringify(data));

    client.send(
      new UploadMessage({
        // when using bson later we can handle buffers correctly
        data: Array.from(new Uint8Array(data.slice(b, e.loaded))),
      })
    );

    b += e.loaded;
  };

  // reader.onloadend = () => client.send();

  reader.readAsArrayBuffer(file);
}

export function uploadFiles(client: Client, remoteDestination: string) {
  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'file';
  input.multiple = true;
  input.formEnctype = 'multipart/form-data';

  input.onchange = e => {
    e.preventDefault();

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      upload(client, file, remoteDestination);
    }
  };
  input.click();
}
