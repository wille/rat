import { IncomingMessage } from "http";
import Message from "shared/message";
import WebClient from "./ws/webClient";

import * as WebSocket from "ws";

class ControlSocketServer {

    public static async broadcast(message: Message) {
        ControlSocketServer.clients.forEach((client) => {
            client.emit(message);
        });
    }

    private static clients: WebClient[] = [];

    private server: WebSocket.Server;

    constructor(options: WebSocket.ServerOptions) {
        this.server = new WebSocket.Server(options, () => {
            console.log("[ws] listening on", options.port);
        });

        this.server.on("connection", (ws, req) => this.onConnection(ws, req));
    }

    private onConnection(ws: WebSocket, req: IncomingMessage) {
        console.log("[ws] connection from", req.connection.remoteAddress);
        const client = new WebClient(ws);

        ws.on("close", (code, reason) => {
            console.log("[ws] lost", req.connection.remoteAddress, code, reason);
            ControlSocketServer.clients.splice(ControlSocketServer.clients.indexOf(client), 1);
        });

        ControlSocketServer.clients.push(client);
    }
}

export default ControlSocketServer;
