import ControlSocket from "@app/control";
import Message from "@shared/messages/index";
import SubscribeMessage from "@shared/messages/subscribe";
import { MessageType } from "@shared/types";
import MessageTemplate from "@templates/index";

export default interface MessageHandler<T extends MessageTemplate> {
    emit(data: T): void;
}

export { default as ClientHandler } from "./clients";
export { default as ScreenHandler } from "./screen";

interface Subscriber {
    _id: number;
    type: MessageType;
    listener: MessageHandler<any>;
}

const events: Subscriber[] = [];

export function subscribe<T extends MessageTemplate>(type: MessageType, listener: MessageHandler<T>) {
    console.log("subscribing", type);

    if (typeof listener === "function") {
        listener = {
            emit: listener
        } as MessageHandler<T>;
    }

    const id = Math.random();

    events.push({
        _id: id,
        type,
        listener
    });

    ControlSocket.send(new SubscribeMessage({
        type,
        subscribe: true
    }));

    return id;
}

export function unsubscribe<T extends MessageTemplate>(id: number) {
    console.log("unsubscribing");

    events.some((event, index) => {
        if (event._id === id) {
            events.splice(index, 1);

            ControlSocket.send(new SubscribeMessage({
                type: event.type,
                subscribe: false
            }));

            return true;
        }
    });
}

export function emit(message: Message) {
    const clients = events.filter((event) => event.type === message._type);

    clients.forEach((event) => event.listener.emit(message));
}

export function publishSubscriptions() {
    events.forEach((event) => {
        ControlSocket.send(new SubscribeMessage({
            type: event.type,
            subscribe: true
        }));
    });
}
