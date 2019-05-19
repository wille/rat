import { createMessage } from 'shared/messages';

import {
  BrowseTemplate,
  DataTemplate,
  KeyTemplate,
  MouseMotionTemplate,
  MouseTemplate,
  ProcessTemplate,
  RequestDownloadTemplate,
  SubscribeTemplate,
  TransferActionTemplate,
} from 'shared/templates';

import { MessageType } from 'shared/types';

export const BrowseMessage = createMessage<BrowseTemplate>(
  MessageType.Directory
);
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
export const DownloadToServerMessage = createMessage<RequestDownloadTemplate>(
  MessageType.DownloadToServer
);
export const UploadToClientMessage = createMessage<DataTemplate>(
  MessageType.UploadToClient
);
export const TransferActionMessage = createMessage<TransferActionTemplate>(
  MessageType.TransferAction
);
