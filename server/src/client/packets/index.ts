import { MessageTemplate } from '../../../../shared/src/templates/index';
import Client from '../client';
import computerInfoHandler from './computer-info-handler';
import directoryContentHandler from './directory-content-handler';
import pongHandler from './pong-handler';
import processHandler from './process-handler';
import screenFrameHandler from './screen-frame-handler';

const enum PacketType {
  Ping = 0,
  ComputerInfo = 2,
  Screen = 3,
  Directory = 4,
  Process = 5,
}

const mapping = {
  [PacketType.Ping]: pongHandler,
  [PacketType.ComputerInfo]: computerInfoHandler,
  [PacketType.Screen]: screenFrameHandler,
  [PacketType.Directory]: directoryContentHandler,
  [PacketType.Process]: processHandler,
};

export type PacketHandler = <T extends MessageTemplate>(
  data: T,
  client: Client
) => void;

export function handle<T extends MessageTemplate>(client: Client, message: T) {
  const handler = mapping[message._type];

  if (handler) {
    handler(message, client);
  } else {
    throw new Error('failed to find handler for ' + message._type);
  }
}
