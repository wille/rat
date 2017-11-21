import { MessageType } from "../../types";
import Message from "./message";

export default interface SubscribeMessage extends Message {
    _type: MessageType.Subscribe;
}
