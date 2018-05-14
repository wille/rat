import { createMessage } from '../../../../shared/src/messages';
import {
  BrowseTemplate,
  ClientTemplate,
  DirectoryContentTemplate,
  KeyTemplate,
  MouseMotionTemplate,
  MouseTemplate,
  ProcessListTemplate,
  ProcessTemplate,
  ScreenFrameTemplate,
  ScreenTemplate,
} from '../../../../shared/src/templates';
import { MessageType } from '../../../../shared/src/types';

export { default as directoryHandler } from './directory-handler';
export { default as keyHandler } from './key-handler';
export { default as mouseHandler } from './mouse-handler';
export { default as mouseMoveHandler } from './mouse-move-handler';
export { default as processHandler } from './process-handler';
export { default as screenHandler } from './screen-handler';
export { default as subscribeHandler } from './subscribe-handler';

export const BrowseMessage = createMessage<BrowseTemplate>(
  MessageType.Directory
);
export const ClientMessage = createMessage<ClientTemplate>(MessageType.Client);
export const PingMessage = createMessage(MessageType.Ping);
export const ProcessMessage = createMessage<ProcessTemplate>(
  MessageType.Process
);
export const ScreenMessage = createMessage<ScreenTemplate>(MessageType.Screen);
export const MouseMessage = createMessage<MouseTemplate>(MessageType.Mouse);
export const MouseMoveMessage = createMessage<MouseMotionTemplate>(
  MessageType.MouseMove
);
export const KeyMessage = createMessage<KeyTemplate>(MessageType.Key);

export const ProcessListMessage = createMessage<ProcessListTemplate>(
  MessageType.Process
);

export const ScreenFrameMessage = createMessage<ScreenFrameTemplate>(
  MessageType.Screen
);

export const DirectoryContentMessage = createMessage<DirectoryContentTemplate>(
  MessageType.Directory
);
