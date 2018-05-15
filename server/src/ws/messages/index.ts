import { MessageTemplate } from 'shared/templates';
import Client from '~/client/client';

import { createMessage } from '../../../../shared/src/messages';
import {
  ClientTemplate,
  DirectoryContentTemplate,
  ProcessListTemplate,
  ScreenFrameTemplate,
} from '../../../../shared/src/templates';
import { MessageType } from '../../../../shared/src/types';
import WebClient from '../webClient';
import directoryHandler from './directory-handler';
import keyHandler from './key-handler';
import mouseHandler from './mouse-handler';
import mouseMoveHandler from './mouse-move-handler';
import processHandler from './process-handler';
import screenHandler from './screen-handler';
import subscribeHandler from './subscribe-handler';

export const ClientMessage = createMessage<ClientTemplate>(MessageType.Client);

export const ProcessListMessage = createMessage<ProcessListTemplate>(
  MessageType.Process
);

export const ScreenFrameMessage = createMessage<ScreenFrameTemplate>(
  MessageType.Screen
);

export const DirectoryContentMessage = createMessage<DirectoryContentTemplate>(
  MessageType.Directory
);

export type MessageHandler = <T extends MessageTemplate>(
  data: T,
  webClient: WebClient,
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

export const getMessageHandler = (type: MessageType): MessageHandler =>
  mapping[type];
