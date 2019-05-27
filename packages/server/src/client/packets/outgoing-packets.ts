import { createMessage } from 'shared/messages';
import {
  BrowseTemplate,
  KeyTemplate,
  MouseMotionTemplate,
  MouseTemplate,
  ProcessTemplate,
  RequestDownloadTemplate,
  ScreenTemplate,
  UploadTemplate,
} from 'shared/templates';
import { MessageType } from 'shared/types';

export const BrowsePacket = createMessage<BrowseTemplate>(
  MessageType.Directory
);
export const PingPacket = createMessage(MessageType.Ping);
export const ScreenPacket = createMessage<ScreenTemplate>(MessageType.Screen);
export const MousePacket = createMessage<MouseTemplate>(MessageType.Mouse);
export const MouseMovePacket = createMessage<MouseMotionTemplate>(
  MessageType.MouseMove
);
export const KeyPacket = createMessage<KeyTemplate>(MessageType.Key);
export const ProcessPacket = createMessage<ProcessTemplate>(
  MessageType.Process
);
export const RequestDownload = createMessage<RequestDownloadTemplate>(
  MessageType.DownloadToServer
);
export const UploadPacket = createMessage<UploadTemplate>(
  MessageType.UploadToClient
);