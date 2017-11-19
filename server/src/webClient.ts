import { BSON } from "bson";
import * as WebSocket from "ws";

class WebClient {

    constructor(private ws: WebSocket) {
        ws.on("message", (data) => this.onMessage(data));
    }

    private onMessage(data: WebSocket.Data) {
        const bson = new BSON().deserialize(data as Buffer);

        console.log("received", bson);
    }
}

export default WebClient;
