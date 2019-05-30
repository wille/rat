import { createMessage } from 'shared/messages';

import { RequestDownloadTemplate } from 'shared/templates/transfers';
import { MessageType } from 'shared/types';

export interface FileEntry {
  dir: boolean;
  path: string;
  size: number;
  time: string;
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
