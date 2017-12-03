import { MessageType } from "../types";

export interface MessageTemplate {
    _type?: MessageType;
    [key: string]: any;
}

export default class Message<T = any> {

    constructor(public readonly _type: MessageType,
                public readonly data: T) {

    }
}

export { default as SubscribeMessage, SubscribeTemplate } from "./subscribe";
export { default as ClientMessage, ClientTemplate, ClientUpdateType } from "./client";
export { default as ScreenMessage, ScreenTemplate } from "./screen";
