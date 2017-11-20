import { BSON } from "bson";
import * as WebSocket from "ws";

interface Message {
    _type: string;

    [index: string]: any;
}

class WebClient {

    private bson: BSON = new BSON();

    constructor(private ws: WebSocket) {
        ws.on("message", (data) => this.onMessage(data));
    }

    private onMessage(data: WebSocket.Data) {
        const bson = this.bson.deserialize(data as Buffer) as Message;

        console.log("received", bson);
    }
}

export default WebClient;
