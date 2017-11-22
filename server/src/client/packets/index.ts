import { controlSocket } from "~/index";
import Client from "../client";
import ComputerInfoHandler from "./computerInfo";

import Message from "shared/messages";

interface PacketMap {
    [index: string]: PacketHandler<any>;
}

const enum PacketType {
    ComputerInfo = 5
}

const mapping: PacketMap = {
    [PacketType.ComputerInfo]: new ComputerInfoHandler()
};

export interface PacketHandler<T extends Message> {
    handle(client: Client, data: T): void;
}

export function handle<T extends Message>(client: Client, message: T) {
    const handler = mapping[message._type] as PacketHandler<T>;

    if (handler) {
        handler.handle(client, message);
    } else {
        throw new Error("failed to find handler for " + message._type);
    }
}
