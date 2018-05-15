import { MessageType } from 'shared/types';
import { MessageTemplate } from '../../../../shared/src/templates/index';
import Client from '../client';
import computerInfoHandler from './computer-info-handler';
import directoryContentHandler from './directory-content-handler';
import pongHandler from './pong-handler';
import processHandler from './process-handler';
import screenFrameHandler from './screen-frame-handler';

export * from './outgoing-packets';

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

export const selectHandler = (type: MessageType): PacketHandler =>
  mapping[type];
