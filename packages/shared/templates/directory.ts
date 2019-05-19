import MessageTemplate from './template';

export interface FileEntry {
  dir: boolean;
  name: string;
  size: number;
  time: string;

  // is generated client side
  path?: string;
}

export interface DirectoryContentTemplate extends MessageTemplate {
  files: FileEntry[];
}
