import { MessageType } from "../types";
import Message, { MessageTemplate } from "./index";

export interface ScreenTemplate extends MessageTemplate {
    id: string;
    active: boolean;
    scale: number;
    monitor: true;
    handle: number;
}

export default class ScreenMessage extends Message<ScreenTemplate> {

    constructor(message: ScreenTemplate) {
        super(MessageType.Screen, message);
    }
}
