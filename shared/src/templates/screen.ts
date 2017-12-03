import MessageTemplate from "../templates";

export default interface ScreenTemplate extends MessageTemplate {
    id: string;
    active: boolean;
    scale: number;
    monitor: true;
    handle: number;
}
