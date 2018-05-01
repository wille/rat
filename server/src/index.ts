import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as morgan from 'morgan';
import * as path from 'path';
import * as debug from 'debug';

debug.enable('control:*');

import ClientServer from './clientServer';
import ControlSocketServer from './control-socket';

const ports = {
  web: 3000,
  server: 9999
};

const keys = {
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('private.pem'),
};

const app = express();
let webServer;

/**
 * If in development, serve control socket over HTTP
 */
if (process.env.NODE_ENV === 'development') {
  webServer = http.createServer(app);
  app.use('*', (req, res) => {
    res.send('in development mode, run app with webpack');
  });
} else {
  webServer = https.createServer(keys, app);
  app.use(morgan(':remote-addr [:date[clf]] ":method :url" :status :res[content-length] :response-time ms'));
  app.use('*', (req, res, next) => {
    res.header('Content-Security-Policy',
      "default-src 'self'; style-src 'unsafe-inline' 'self'; connect-src 'self' wss://*:*; img-src 'self' data:");
    next();
  });

  app.use(express.static(path.resolve(__dirname, 'app')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'app', 'index.html'));
  });
}

webServer.listen(ports.web, () => {
  console.log('web server running on', ports.web);
});

export const controlSocket = new ControlSocketServer(webServer);
export const clientServer = new ClientServer(ports.server);
