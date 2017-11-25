import { BSON } from "bson";
import Message from "shared/messages";

import * as EventHandler from "./messages";
import { publishSubscriptions } from "./messages";

class ControlSocket {

    public clients: any[] = [];

    private readonly bson = new BSON();
    private socket: WebSocket;
    private queue: Message[] = [];

    constructor(private readonly url: string) {

    }

    public connect() {
        this.socket = new WebSocket(this.url);
        this.socket.onmessage = (e: MessageEvent) => this.handleMessage(e);
        this.socket.onclose = (e: CloseEvent) => this.onClose(e);
        this.socket.onopen = () => this.onOpen();
    }

    public send(m: Message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(this.bson.serialize({
                _type: m._type,
                ...m.data
            }));
        } else {
            this.queue.push(m);
        }
    }

    private onOpen() {
        console.log("[ws] connected");

        publishSubscriptions();

        this.queue.forEach((queued) => {
            this.send(queued);
        });
        this.queue = [];
    }

    private onBounce(data: any) {
        console.log("bounce", data);
    }

    private handleMessage(e: MessageEvent) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const bson = this.bson.deserialize(Buffer.from(reader.result));
            EventHandler.emit(bson);
        };

        reader.readAsArrayBuffer(e.data);
    }

    private onClose(e: CloseEvent) {
        setTimeout(() => this.connect(), 1000);
    }
}

export default new ControlSocket("ws://localhost:3000");
