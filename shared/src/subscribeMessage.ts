import Message from "./message";
import { MessageType } from "./types";

interface SubscribeMessage extends Message {
    type: MessageType;
    subscribe: boolean;
}

export default SubscribeMessage;
