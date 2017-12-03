import { MessageType } from "../types";

export default interface MessageTemplate {
    _type?: MessageType;
    [key: string]: any;
}
