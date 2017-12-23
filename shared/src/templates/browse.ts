import MessageTemplate from "./template";

export default interface BrowseTemplate extends MessageTemplate {
    path: string;
}
