import { BSON } from "bson";
import * as WebSocket from "ws";
import Message from "../message";
import * as message from "../ws/messages";

class WebClient {

    private readonly bson = new BSON();

    constructor(private ws: WebSocket) {
        ws.on("message", (data) => this.onMessage(data));
    }

    public emit(m: Message) {
        const buffer = this.bson.serialize(m);
        this.ws.send(buffer);
    }

    private onMessage(data: WebSocket.Data) {
        const m = this.bson.deserialize(data as Buffer) as Message;
        message.emit(m);
    }
}

export default WebClient;
