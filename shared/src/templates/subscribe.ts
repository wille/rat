import { MessageType } from "../types";
import MessageTemplate from "./template";

export default interface SubscribeTemplate extends MessageTemplate {
    type: MessageType;
    subscribe: boolean;
}
