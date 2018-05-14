import chalk from 'chalk';

import { MessageTemplate } from 'shared/templates';
import Client from '~/client/client';
import { Message } from '../../../../shared/src/messages';
import { MessageType } from '../../../../shared/src/types';
import {
  directoryHandler,
  keyHandler,
  mouseHandler,
  mouseMoveHandler,
  processHandler,
  screenHandler,
  subscribeHandler,
} from '../messages';
import WebClient from '../webClient';

const debug = require('debug')('control:ws');

export type MessageHandler = <T extends MessageTemplate>(
  data: T,
  client?: Client
) => void;

const mapping = {
  [MessageType.Subscribe]: subscribeHandler,
  [MessageType.Screen]: screenHandler,
  [MessageType.Directory]: directoryHandler,
  [MessageType.Process]: processHandler,
  [MessageType.Mouse]: mouseHandler,
  [MessageType.MouseMove]: mouseMoveHandler,
  [MessageType.Key]: keyHandler,
};

export function handle<T extends Message>(client: WebClient, message: T) {
  const handler = mapping[message._type] as MessageHandler;

  if (handler) {
    handler(message, null);
  } else {
    debug('failed to find handler', chalk.bold(message._type + ''), message);
  }
}
