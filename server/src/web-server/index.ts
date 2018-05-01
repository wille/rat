const debug = require('debug')('server:http');

import chalk from 'chalk';
import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

import generateCert from './cert-generator';

import csp from './middlewares/content-security-policy';
import spa from './middlewares/spa';

let cert;
let key;

if (['cert.pem', 'private.pem'].every(file => fs.existsSync(file))) {
  debug('loading certificate from files');

  cert = fs.readFileSync('cert.pem');
  key = fs.readFileSync('private.pem');
} else {
  const generated = generateCert();

  try {
    fs.writeFileSync('cert.pem', generated.certificate);
    fs.writeFileSync('private.pem', generated.privateKey);
  } catch (e) {
    debug('failed to write cert', e);
  }

  cert = generated.certificate;
  key = generated.privateKey;
}

const app = express();
const server = https.createServer(
  {
    cert,
    key,
  },
  app
);

app.use('*', csp);
app.use(express.static(path.resolve(__dirname, 'app')));
app.get('*', spa);

const port = 3000;

server.listen(port, () =>
  debug('web server running on', chalk.bold(port + ''))
);

export default server;
