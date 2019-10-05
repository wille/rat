import { MessageType } from "../../../shared/types";
import MessageTemplate from "./template";

export interface SubscribeTemplate extends MessageTemplate {
    type: MessageType;
    subscribe: boolean;
}
