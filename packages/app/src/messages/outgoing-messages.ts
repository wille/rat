import { createMessage } from 'shared/messages';

import {
  DataTemplate,
  KeyTemplate,
  MouseMotionTemplate,
  MouseTemplate,
  ProcessTemplate,
  SubscribeTemplate,
  TransferActionTemplate,
} from 'shared/templates';

import { MessageType } from 'shared/types';

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
export const UploadToClientMessage = createMessage<DataTemplate>(
  MessageType.UploadToClient
);
export const TransferActionMessage = createMessage<TransferActionTemplate>(
  MessageType.TransferAction
);
