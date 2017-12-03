import MessageTemplate from "../../../../shared/src/templates/index";
import Client from "../client";
import ComputerInfoHandler from "./computerInfo.handler";
import PongHandler from "./pong.handler";
import ScreenFrameHandler from "./screenFrame.handler";

interface PacketMap {
    [index: string]: PacketHandler<any>;
}

const enum PacketType {
    Ping = 0,
    ComputerInfo = 2,
    Screen = 3
}

const mapping: PacketMap = {
    [PacketType.Ping]: new PongHandler(),
    [PacketType.ComputerInfo]: new ComputerInfoHandler(),
    [PacketType.Screen]: new ScreenFrameHandler()
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
