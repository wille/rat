import MessageTemplate from "./template";

export interface FileEntry {
    path: string;
    directory: boolean;
    size: string;
    time: string;
}

export default interface DirectoryContentTemplate extends MessageTemplate {
    files: FileEntry[];
}
