import Message from "./message";
import { MessageType } from "./types";

export interface MessageHandler<T extends Message> {
    readonly _type: MessageType;
    emit(message: T): void;
}

const events: MessageHandler<any>[] = [];

export function subscribe<T extends Message>(handler: MessageHandler<T>) {
    console.log("subscribing", handler._type);
    events.push(handler);
}

export function unsubscribe<T extends Message>(handler: MessageHandler<T>) {
    console.log("unsubscribing", events.indexOf(handler) !== -1);
    delete events[events.indexOf(handler)];
}

export function emit(message: Message) {
    console.log("emitting message", message._type);
    events.filter((event) => event._type === message._type).forEach((event) => event.emit(message));
}
