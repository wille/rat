import { BSON } from 'bson';
import chalk from 'chalk';
import * as WebSocket from 'ws';
import { getMessageHandler } from '~/ws/messages';

import { clientServer } from '..';
import { Message } from '../../../shared/src/messages';
import { MessageType } from '../../../shared/src/types';

const debug = require('debug')('control:ws');

class WebClient {
  public subscribed: MessageType[] = [];
  private readonly bson = new BSON();

  constructor(private ws: WebSocket) {
    ws.on('message', data => this.onMessage(data));
  }

  public emit(m: Message, force: boolean = false) {
    if (force || this.subscribed.indexOf(m._type) > -1) {
      this.send(m);
    }
  }

  private send(m: Message) {
    const buffer = this.bson.serialize(m);

    this.ws.send(buffer);
  }

  private onMessage(data: WebSocket.Data) {
    const m = this.bson.deserialize(data as Buffer) as Message;
    this.handle(m);
  }

  private handle<T extends Message>(message: T) {
    const handler = getMessageHandler(message._type);

    if (handler) {
      let client;

      if (message._id) {
        client = clientServer.getById(message._id);

        if (!client) {
          throw new Error("couldn't find client with id " + message.data._id);
        }
      }

      handler(message.data, this, client);
    } else {
      debug('failed to find handler', chalk.bold(message._type + ''), message);
    }
  }
}

export default WebClient;
