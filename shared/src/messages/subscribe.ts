import { MessageType } from "shared/types";
import Message from "./index";

interface SubscribeMessage extends Message {
    type: MessageType;
    subscribe: boolean;
}

export default SubscribeMessage;
