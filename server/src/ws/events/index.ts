import { controlSocket } from "~/index";

import Message from "shared/messages";
import { MessageType } from "shared/types";

import WebClient from "../webClient";

import SubscribeHandler from "./subscribe";

interface MessageMap {
    [index: string]: MessageHandler<any>;
}

const mapping: MessageMap = {
    [MessageType.Subscribe]: new SubscribeHandler()
};

export interface MessageHandler<T extends any> {
    handle(client: WebClient, data: T): void;
}

export function handle<T extends Message>(client: WebClient, message: T) {
    const handler = mapping[message._type] as MessageHandler<T>;

    if (handler) {
        handler.handle(client, message);
    } else {
        console.warn("[ws] failed to find handler", message._type, message);
    }
}
