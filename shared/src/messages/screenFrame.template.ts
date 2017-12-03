import { MessageType } from "../types";
import Message, { MessageTemplate } from "./index";

export default interface ScreenFrameTemplate extends MessageTemplate {
    buffer: any;
}
