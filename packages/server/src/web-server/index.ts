const debug = require('debug')('server:http');

import chalk from 'chalk';
import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

import generateCert from './cert-generator';

import downloadRoute from './download';

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

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; style-src 'unsafe-inline' 'self'; connect-src 'self' wss://*:*; img-src 'self' data:; frame-ancestors 'none'"
  );
  next();
});

app.get('/download/:id', downloadRoute);
app.use(express.static(path.resolve(__dirname, 'app')));
app.get('*', (req, res, next) =>
  res.sendFile(path.resolve(__dirname, 'app', 'index.html'))
);

const port = 3000;

server.listen(port, () =>
  debug('web server running on', chalk.bold(port + ''))
);

export default server;
