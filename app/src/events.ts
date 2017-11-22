import { MessageType } from "shared/types";
import ControlSocket from "./control";

import Message, { SubscribeMessage } from "shared/messages";

interface MessageHandler<T extends Message> {
    readonly type: MessageType;
    listener(message: T): void;
}

const events: MessageHandler<any>[] = [];

export function subscribe<T extends Message>(type: MessageType, listener: (data: T) => void) {
    console.log("subscribing", type);
    events.push({
        type,
        listener
    });
    ControlSocket.send({
        _type: MessageType.Subscribe,
        type,
        subscribe: true
    } as SubscribeMessage);
}

export function unsubscribe<T extends Message>(type: MessageType, listener: (data: T) => void) {
    console.log("unsubscribing");

    events.some((event, index) => {
        if (event.listener === listener) {
            events.splice(index, 1);
            return true;
        }
    });
    ControlSocket.send({
        _type: MessageType.Subscribe,
        type,
        subscribe: false
    } as SubscribeMessage);
}

export function emit(message: Message) {
    const clients = events.filter((event) => event.type === message._type);

    console.log("triggered", message._type);

    clients.forEach((event) => event.listener(message));
}
