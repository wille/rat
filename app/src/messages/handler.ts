import Message from "shared/message";
import { MessageType } from "shared/types";

import BounceHandler from "./bounceHandler";

interface MessageMap {
    [index: string]: MessageHandler<any>;
}

const mapping: MessageMap = {
    [MessageType.Bounce]: new BounceHandler()
};

export interface MessageHandler<T extends Message> {
    handle(data: T): void;
}

export function handle<T extends Message>(message: T) {
    const handler = mapping[message._type] as MessageHandler<T>;

    if (handler) {
        handler.handle(message);
    } else {
        throw new Error("failed to find handler for " + message._type);
    }
}
