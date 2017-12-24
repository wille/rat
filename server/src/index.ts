import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import * as path from 'path';

import ClientServer from './clientServer';
import ControlSocketServer from './controlSocketServer';

const ports = {
  web: 3000,
  server: 9999
};

const app = express();
app.use(morgan(':remote-addr [:date[clf]] ":method :url" :status :res[content-length] :response-time ms'));
app.use(express.static(path.resolve(__dirname, 'app')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'app', 'index.html'));
});

const webServer = http.createServer(app);
webServer.listen(ports.web, () => {
  console.log('web server running on', ports.web);
});

export const controlSocket = new ControlSocketServer(webServer);
export const clientServer = new ClientServer(ports.server);
