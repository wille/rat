import { enable } from 'debug';

import ClientServer from './clientServer';
import ControlSocketServer from './control-socket';
import webServer from './web-server';

enable('server:*');

const ports = {
  server: 9999,
};

export const controlSocket = new ControlSocketServer(webServer);
export const clientServer = new ClientServer(ports.server);
