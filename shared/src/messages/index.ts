import { MessageType } from "../types";

export { default as SubscribeMessage } from "./subscribe";
export { default as ClientMessage } from "./client";

export default interface Message {
    _type: MessageType;
    [key: string]: any;
}
