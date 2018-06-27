import MessageTemplate from "./template";

export interface FileEntry {
  directory: boolean;
  name: string;
  size: string;
  time: string;

  // is generated client side
  path?: string;
}

export interface DirectoryContentTemplate extends MessageTemplate {
  files: FileEntry[];
}
