import MessageTemplate from "./template";

export default interface ScreenTemplate extends MessageTemplate {
    active: boolean;
    scale?: number;
    monitor?: true;
    handle?: number;
}
