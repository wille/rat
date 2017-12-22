import MessageTemplate from "../templates";

export default interface ScreenTemplate extends MessageTemplate {
    active: boolean;
    scale?: number;
    monitor?: true;
    handle?: number;
}
