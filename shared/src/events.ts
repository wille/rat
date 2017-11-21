import Message from "./message";
import { MessageType } from "./types";

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
}

export function unsubscribe<T extends Message>(listener: (data: T) => void) {
    console.log("unsubscribing");

    events.some((event, index) => {
        if (event.listener === listener) {
            events.splice(index, 1);
            return true;
        }
    });
}

export function emit(message: Message) {
    const clients = events.filter((event) => event.type === message._type);

    console.log("emitting", message._type, "to", clients.length, "clients");

    clients.forEach((event) => event.listener(message));
}
