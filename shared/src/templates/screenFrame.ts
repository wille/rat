import MessageTemplate from "./template";

export default interface ScreenFrameTemplate extends MessageTemplate {
    width: number;
    height: number;
    data: Buffer;
}
