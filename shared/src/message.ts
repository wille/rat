import { MessageType } from "./types";

export default interface Message {
    _type: MessageType;
    [key: string]: any;
}
