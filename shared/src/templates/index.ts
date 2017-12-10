import { MessageType } from "../types";

export default interface MessageTemplate {
    _type?: MessageType;
    _id?: string;
    [key: string]: any;
}
