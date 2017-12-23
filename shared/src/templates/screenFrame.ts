import MessageTemplate from "./index";

export default interface ScreenFrameTemplate extends MessageTemplate {
    width: number;
    height: number;
    data: Buffer;
}
