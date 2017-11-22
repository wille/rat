import { BSON } from "bson";
import Message from "shared/messages";
import { MessageType } from "../../shared/src/types";

import * as EventHandler from "./messages";

import { setInterval } from "timers";

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

    public send(data: Message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(this.bson.serialize(data));
        } else {
            this.queue.push(data);
        }
    }

    private onOpen() {
        console.log("[ws] connected");

        this.queue.forEach((queued) => {
            this.send(queued);
        });
        this.queue = [];

        const bounce = EventHandler.subscribe(MessageType.Bounce, { emit: this.onBounce });

        setInterval(() => {
            this.send({
                _type: MessageType.Bounce,
                data: "ping"
            });
        }, 1000);

        setTimeout(() => {
            EventHandler.unsubscribe(bounce);
        }, 3000);
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
