import { MessageType } from "../types";
import Message, { MessageTemplate } from "./index";

export interface SubscribeTemplate extends MessageTemplate {
    type: MessageType;
    subscribe: boolean;
}

class SubscribeMessage extends Message<SubscribeTemplate> {

    constructor(message: SubscribeTemplate) {
        super(MessageType.Subscribe, message);
    }
}

export default SubscribeMessage;
