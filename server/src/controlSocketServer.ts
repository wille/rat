import { IncomingMessage } from "http";
import * as WebSocket from "ws";
import WebClient from "./webClient";

class ControlSocketServer {

    private server: WebSocket.Server;
    private clients: WebClient[] = [];

    constructor(options: WebSocket.ServerOptions) {
        this.server = new WebSocket.Server(options, () => {
            console.log("control listening on", options.port);
        });

        this.server.on("connection", (ws, req) => this.onConnection(ws, req));
    }

    private onConnection(ws: WebSocket, req: IncomingMessage) {
        console.log("incoming control connection", req.connection.remoteAddress);
        const client = new WebClient(ws);

        ws.on("close", (code, reason) => {
            console.log("control connection closed", code, reason);
            this.clients.splice(this.clients.indexOf(client), 1);
        });

        this.clients.push(client);
    }
}

export default ControlSocketServer;
