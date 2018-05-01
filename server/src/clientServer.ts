import chalk from 'chalk';
import * as fs from 'fs';
import * as geoip from 'geoip-lite';
import { setInterval } from 'timers';
import * as tls from 'tls';

import { ClientUpdateType } from '../../shared/src/templates/client';
import Client from './client/client';
import ControlSocketServer from './control-socket';
import ClientMessage from './ws/messages/client.message';

const debug = require('debug')('server:tls');

class ClientServer {
  public readonly clients: Client[] = [];
  private server: tls.Server;

  constructor(port: number) {
    const options = {
      cert: fs.readFileSync('cert.pem'),
      key: fs.readFileSync('private.pem'),
      rejectUnauthorized: false,
      requestCert: true,
    };
    debug('listening on', chalk.bold(':' + port));

    this.server = tls.createServer(options, socket =>
      this.onConnection(socket)
    );
    this.server.listen(port);
    setInterval(() => this.ping(), 2500);
  }

  public getById(
    id: string | { _id?: string },
    callback: (client: Client) => void
  ) {
    if (typeof id === 'object') {
      id = id._id;
    }

    const clients = this.clients.filter(x => x.id === id);

    if (clients.length > 0) {
      callback(clients[0]);
    }
  }

  private ping() {
    this.clients.forEach(client => client.sendPing());
  }

  private onConnection(socket: tls.TLSSocket) {
    debug('connect', chalk.bold(socket.remoteAddress));
    socket.setTimeout(5000);

    const client = new Client(socket);

    const lookup = geoip.lookup(socket.remoteAddress) || {
      country: 'unknown',
    };

    ControlSocketServer.broadcast(
      new ClientMessage({
        type: ClientUpdateType.ADD,
        ...client.getClientProperties(),
      }),
      true
    );

    socket.on('close', () => {
      debug('lost', chalk.bold(socket.remoteAddress));
      this.clients.splice(this.clients.indexOf(client), 1);

      ControlSocketServer.broadcast(
        new ClientMessage({
          type: ClientUpdateType.REMOVE,
          id: client.id,
        }),
        true
      );
    });

    this.clients.push(client);
  }
}

export default ClientServer;
