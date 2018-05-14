import { createMessage } from 'shared/messages';

import {
  BrowseTemplate,
  KeyTemplate,
  MouseMotionTemplate,
  MouseTemplate,
  ProcessTemplate,
  ScreenTemplate,
  SubscribeTemplate,
} from 'shared/templates';

import { MessageType } from 'shared/types';

export const BrowseMessage = createMessage<BrowseTemplate>(
  MessageType.Directory
);
export const ProcessMessage = createMessage<ProcessTemplate>(
  MessageType.Process
);
export const StreamMessage = createMessage<ScreenTemplate>(MessageType.Screen);
export const SubscribeMessage = createMessage<SubscribeTemplate>(
  MessageType.Subscribe
);
export const KeyMessage = createMessage<KeyTemplate>(MessageType.Key);
export const MouseMessage = createMessage<MouseTemplate>(MessageType.Mouse);
export const MouseMoveMessage = createMessage<MouseMotionTemplate>(
  MessageType.MouseMove
);
