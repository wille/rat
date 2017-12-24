import MessageTemplate from "./template";

export interface ScreenTemplate extends MessageTemplate {
    active: boolean;
    scale?: number;
    monitor?: true;
    handle?: number;
}
