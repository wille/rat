import Message, { SubscribeMessage } from "shared/messages";
import { MessageType } from "shared/types";
import ControlSocket from "../control";

export default interface MessageHandler<T> {
    emit(data: T): void;
}

export { default as ClientHandler } from "./clients";

interface Subscriber {
    _id: number;
    type: MessageType;
    listener: MessageHandler<any>;
}

const events: Subscriber[] = [];

export function subscribe<T extends Message>(type: MessageType, listener: MessageHandler<T>) {
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

    ControlSocket.send({
        _type: MessageType.Subscribe,
        type,
        subscribe: true
    } as SubscribeMessage);

    return id;
}

export function unsubscribe<T extends Message>(id: number) {
    console.log("unsubscribing");

    events.some((event, index) => {
        if (event._id === id) {
            events.splice(index, 1);

            ControlSocket.send({
                _type: MessageType.Subscribe,
                type: event.type,
                subscribe: false
            } as SubscribeMessage);

            return true;
        }
    });
}

export function emit(message: Message) {
    const clients = events.filter((event) => event.type === message._type);

    console.log("triggered", message._type);

    clients.forEach((event) => event.listener.emit(message));
}

export function publishSubscriptions() {
    events.forEach((event) => {
        ControlSocket.send({
            _type: MessageType.Subscribe,
            type: event.type,
            subscribe: true
        } as SubscribeMessage);

        console.log("publishing subscription");
    });
}
