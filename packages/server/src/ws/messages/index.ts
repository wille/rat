import { MessageTemplate, TransferTemplate } from 'shared/templates';
import Client from '../../client/client';

import { createMessage } from 'shared/messages';
import {
  ClientTemplate,
  DirectoryContentTemplate,
  ProcessListTemplate,
  ScreenFrameTemplate,
} from 'shared/templates';
import { MessageType } from 'shared/types';
import WebClient from '../webClient';
import directoryHandler from './directory-handler';
import keyHandler from './key-handler';
import mouseHandler from './mouse-handler';
import mouseMoveHandler from './mouse-move-handler';
import processHandler from './process-handler';
import requestDownloadHandler from './request-download-handler';
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

export const TransferMessage = createMessage<TransferTemplate>(
  MessageType.Transfers
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
  [MessageType.DownloadToServer]: requestDownloadHandler,
};

export const getMessageHandler = (type: MessageType): MessageHandler =>
  mapping[type];
