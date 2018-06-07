import chalk from 'chalk';
import { IncomingMessage } from 'http';
import * as https from 'https';
import * as WebSocket from 'ws';

import { Message } from '../../shared/src/messages';
import { ClientUpdateType } from '../../shared/src/templates/client';
import { clientServer } from './index';
import { ClientMessage, TransferMessage } from './ws/messages';
import WebClient from './ws/webClient';

import * as Transfers from './transfers';

const debug = require('debug')('server:ws');

class ControlSocketServer {
  /**
   * Broadcast websocket message to all connected clients
   * that has subscribed to the event
   * @param message
   * @param force sending even if client is not subscribed
   */
  public static async broadcast(message: Message, force: boolean = false) {
    ControlSocketServer.clients.forEach(client => client.emit(message, force));
  }

  /**
   * All globally connected clients
   */
  private static clients: WebClient[] = [];

  private server: WebSocket.Server;

  constructor(server: https.Server) {
    this.server = new WebSocket.Server({ server });
    this.server.on('connection', (ws, req) => this.onConnection(ws, req));
  }

  private onConnection(ws: WebSocket, req: IncomingMessage) {
    debug('connect', chalk.bold(req.connection.remoteAddress));

    const client = new WebClient(ws);

    // broadcast all connected clients to new websocket connection
    clientServer.clients.forEach(c =>
      client.emit(
        new ClientMessage({
          initial: true,
          type: ClientUpdateType.ADD,
          ...c.getClientProperties(),
          ...c.getSystemProperties(),
        }),
        true
      )
    );

    Transfers.transfersList.forEach(transfer =>
      client.emit(new TransferMessage(transfer), true)
    );

    ws.on('close', (code, reason) => {
      debug(
        `lost ${chalk.bold(req.connection.remoteAddress)} ${code} (${reason})`
      );

      ControlSocketServer.clients.splice(
        ControlSocketServer.clients.indexOf(client),
        1
      );
    });

    ControlSocketServer.clients.push(client);
  }
}

export default ControlSocketServer;
