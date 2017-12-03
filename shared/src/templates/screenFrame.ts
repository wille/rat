import MessageTemplate from "./index";

export default interface ScreenFrameTemplate extends MessageTemplate {
    data: Buffer;
}
