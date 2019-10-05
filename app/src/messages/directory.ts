import { createMessage } from 'app/types/messages';

import { MessageType } from 'app/messages/types';
import { Binary } from 'bson';

export interface FileEntry {
  dir: boolean;
  path: string;
  size: number;
  time: number;
}

export type DirectoryContentTemplate = FileEntry[];
export type DirectoryQueryTemplate = string;

export const BrowseMessage = createMessage<DirectoryQueryTemplate>(
  MessageType.Directory
);

interface TransferTemplate {
  paths: FileEntry[];
}

export const RequestTransfersMessage = createMessage<TransferTemplate>(
  MessageType.RequestTransfers
);

interface UploadTemplate {
  dest: string;
  name: string;
  size: number;
}

interface UploadDataTemplate {
  // temporary until we can handle buffers correctly
  data: number[];
}

export const UploadMessage = createMessage<UploadTemplate | UploadDataTemplate>(
  MessageType.UploadToClient
);
