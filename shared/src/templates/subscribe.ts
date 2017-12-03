import { MessageType } from "../types";
import MessageTemplate from "./";

export default interface SubscribeTemplate extends MessageTemplate {
    type: MessageType;
    subscribe: boolean;
}
