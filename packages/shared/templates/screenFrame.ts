import MessageTemplate from "./template";

export interface ScreenFrameTemplate extends MessageTemplate {
    width: number;
    height: number;
    data: Buffer;
}
