import MessageTemplate from "./template";

export interface FileEntry {
  directory: boolean;
  name: string;
  path: string;
  size: string;
  time: string;
}

export interface DirectoryContentTemplate extends MessageTemplate {
  files: FileEntry[];
}
