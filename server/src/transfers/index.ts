import * as fs from 'fs';
import * as tmp from 'tmp';

const debug = require('debug')('server:transfer');

const transfers = {};

class Transfer {
  private fd: number;

  constructor(readonly file: string) {
    const tempFile = tmp.fileSync();
    debug('writing', file, 'to', tempFile.name);
    this.fd = tempFile.fd;
  }

  public write(data: Buffer) {
    fs.writeFileSync(this.fd, data);
  }

  public close() {
    fs.closeSync(this.fd);
  }
}

export function createTransfer(file: string): Transfer {
  return transfers[file] || (transfers[file] = new Transfer(file));
}
