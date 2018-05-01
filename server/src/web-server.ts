const debug = require('debug')('server:http');

import chalk from 'chalk';
import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

const keys = {
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('private.pem'),
};

const app = express();
const server = https.createServer(keys, app);

app.use('*', (req, res, next) => {
  res.header(
    'Content-Security-Policy',
    "default-src 'self'; style-src 'unsafe-inline' 'self'; connect-src 'self' wss://*:*; img-src 'self' data:"
  );
  next();
});

app.use(express.static(path.resolve(__dirname, 'app')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'app', 'index.html'));
});

const port = 3000;

server.listen(port, () => {
  debug('web server running on', chalk.bold(port + ''));
});

export default server;
