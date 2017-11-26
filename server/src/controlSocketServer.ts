import { IncomingMessage } from "http";
import Message from "shared/messages";
import * as WebSocket from "ws";

import { ClientUpdateType } from "../../shared/src/messages/client";
import ClientMessage from "../../shared/src/messages/client";
import { clientServer } from "./index";
import WebClient from "./ws/webClient";

class ControlSocketServer {

    public static async broadcast(message: Message, force: boolean = false) {
        ControlSocketServer.clients.forEach((client) => {
            client.emit(message, force);
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

        clientServer.clients.forEach((c) => {
            client.emit(new ClientMessage({
                type: ClientUpdateType.ADD,
                id: c.id,
                host: c.host
            }), true);
        });

        ws.on("close", (code, reason) => {
            console.log("[ws] lost", req.connection.remoteAddress, code, reason);
            ControlSocketServer.clients.splice(ControlSocketServer.clients.indexOf(client), 1);
        });

        ControlSocketServer.clients.push(client);
    }
}

export default ControlSocketServer;
