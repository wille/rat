import { BSON } from "bson";
import * as WebSocket from "ws";

import Message from "../../../shared/src/messages";
import { MessageType } from "../../../shared/src/types";
import { handle } from "./events";

class WebClient {

    public subscribed: MessageType[] = [];
    private readonly bson = new BSON();

    constructor(private ws: WebSocket) {
        ws.on("message", (data) => this.onMessage(data));
    }

    public emit(m: Message, force: boolean = false) {
        if (force || this.subscribed.includes(m._type)) {
            this.send(m);
        }
    }

    private send(m: Message) {
        const buffer = this.bson.serialize({
            _type: m._type,
            ...m.data
        });

        this.ws.send(buffer);
    }

    private onMessage(data: WebSocket.Data) {
        const m = this.bson.deserialize(data as Buffer) as Message;
        handle(this, m);
    }
}

export default WebClient;
