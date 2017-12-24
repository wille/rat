import Message from 'shared/messages';
import { MessageType } from 'shared/types';
import MouseMotionHandler from './mouseMove';

import WebClient from '../webClient';
import DirectoryHandler from './directory.handler';
import KeyHandler from './key';
import MouseHandler from './mouse';
import ProcessHandler from './process.handler';
import ScreenHandler from './screen.handler';
import SubscribeHandler from './subscribe.handler';

interface MessageMap {
  [index: string]: MessageHandler<any>;
}

const mapping: MessageMap = {
  [MessageType.Subscribe]: new SubscribeHandler(),
  [MessageType.Screen]: new ScreenHandler(),
  [MessageType.Directory]: new DirectoryHandler(),
  [MessageType.Process]: new ProcessHandler(),
  [MessageType.Mouse]: new MouseHandler(),
  [MessageType.MouseMove]: new MouseMotionHandler(),
  [MessageType.Key]: new KeyHandler()
};

export interface MessageHandler<T extends any> {
  handle(client: WebClient, data: T): void;
}

export function handle<T extends Message>(client: WebClient, message: T) {
  const handler = mapping[message._type] as MessageHandler<T>;

  if (handler) {
    handler.handle(client, message);
  } else {
    console.warn('[ws] failed to find handler', message._type, message);
  }
}
