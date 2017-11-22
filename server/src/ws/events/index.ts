import { controlSocket } from "~/index";

import Message from "shared/messages";
import { MessageType } from "shared/types";

import WebClient from "../webClient";

import BounceHandler from "./bounce";
import SubscribeHandler from "./subscribe";

interface MessageMap {
    [index: string]: MessageHandler<any>;
}

const mapping: MessageMap = {
    [MessageType.Bounce]: new BounceHandler(),
    [MessageType.Subscribe]: new SubscribeHandler()
};

export interface MessageHandler<T extends Message> {
    handle(client: WebClient, data: T): void;
}

export function handle<T extends Message>(client: WebClient, message: T) {
    const handler = mapping[message._type] as MessageHandler<T>;

    if (handler) {
        handler.handle(client, message);
    } else {
        throw new Error("failed to find handler for " + message._type);
    }
}
