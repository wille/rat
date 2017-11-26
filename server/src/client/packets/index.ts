import { MessageTemplate } from "../../../../shared/src/messages";
import Client from "../client";
import ComputerInfoHandler from "./computerInfo";
import PongHandler from "./pong";

interface PacketMap {
    [index: string]: PacketHandler<any>;
}

const enum PacketType {
    Ping = 0,
    ComputerInfo = 2
}

const mapping: PacketMap = {
    [PacketType.Ping]: new PongHandler(),
    [PacketType.ComputerInfo]: new ComputerInfoHandler(),
};

export interface PacketHandler<T extends MessageTemplate> {
    handle(client: Client, data: T): void;
}

export function handle<T extends MessageTemplate>(client: Client, message: T) {
    const handler = mapping[message._type] as PacketHandler<T>;

    if (handler) {
        handler.handle(client, message);
    } else {
        console.log(message);
        throw new Error("failed to find handler for " + message._type);
    }
}
