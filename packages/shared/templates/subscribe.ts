import { MessageType } from "../types";
import MessageTemplate from "./template";

export interface SubscribeTemplate extends MessageTemplate {
    type: MessageType;
    subscribe: boolean;
}
