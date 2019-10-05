import { createMessage } from 'app/types/messages';

import {
  KeyTemplate,
  MouseMotionTemplate,
  MouseTemplate,
  ProcessTemplate,
  SubscribeTemplate,
} from 'app/types';

import { MessageType } from 'app/messages/types';

export const ProcessMessage = createMessage<ProcessTemplate>(
  MessageType.Process
);
export const SubscribeMessage = createMessage<SubscribeTemplate>(
  MessageType.Subscribe
);
export const KeyMessage = createMessage<KeyTemplate>(MessageType.Key);
export const MouseMessage = createMessage<MouseTemplate>(MessageType.Mouse);
export const MouseMoveMessage = createMessage<MouseMotionTemplate>(
  MessageType.MouseMove
);
