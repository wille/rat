const debug = require('debug')('server:http');

import chalk from 'chalk';
import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

import csp from './middlewares/content-security-policy';
import spa from './middlewares/spa';

const keys = {
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('private.pem'),
};

const app = express();
const server = https.createServer(keys, app);

app.use('*', csp);
app.use(express.static(path.resolve(__dirname, 'app')));
app.get('*', spa);

const port = 3000;

server.listen(port, () =>
  debug('web server running on', chalk.bold(port + ''))
);

export default server;
