import { BSON } from "bson";
import * as WebSocket from "ws";
import { handle } from "./handler";

import Message from "shared/message";

class WebClient {

    private readonly bson = new BSON();

    constructor(private ws: WebSocket) {
        ws.on("message", (data) => this.onMessage(data));
    }

    public send(m: Message) {
        const buffer = this.bson.serialize(m);
        this.ws.send(buffer);
    }

    private onMessage(data: WebSocket.Data) {
        const m = this.bson.deserialize(data as Buffer) as Message;
        handle(this, m);
    }
}

export default WebClient;
