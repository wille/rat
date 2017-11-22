import { BSON } from "bson";
import * as WebSocket from "ws";
import { handle } from "./events";

import Message from "shared/messages";
import { MessageType } from "shared/types";

class WebClient {

    public subscribed: MessageType[] = [];
    private readonly bson = new BSON();

    constructor(private ws: WebSocket) {
        ws.on("message", (data) => this.onMessage(data));
    }

    public emit(m: Message) {
        if (this.subscribed.includes(m._type)) {
            this.send(m);
        }
    }

    private send(m: Message) {
        const buffer = this.bson.serialize(m);
        this.ws.send(buffer);
    }

    private onMessage(data: WebSocket.Data) {
        const m = this.bson.deserialize(data as Buffer) as Message;
        handle(this, m);
    }
}

export default WebClient;
