import * as fs from "fs";
import * as tls from "tls";

import ClientMessage, { ClientUpdateType } from "../../shared/src/messages/client";
import Client from "./client/client";
import ControlSocketServer from "./controlSocketServer";

class ClientServer {

    public readonly clients: Client[] = [];
    private server: tls.Server;

    constructor(port: number) {
        const options = {
            cert: fs.readFileSync("cert.pem"),
            key: fs.readFileSync("private.pem"),
            rejectUnauthorized: false,
            requestCert: true
        };
        console.log("[tls] listening on", port);

        this.server = tls.createServer(options, (socket) => this.onConnection(socket));
        this.server.listen(port);
    }

    private onConnection(socket: tls.TLSSocket) {
        console.log("[tls] connection from", socket.remoteAddress);
        const client = new Client(socket);

        ControlSocketServer.broadcast(new ClientMessage({
            type: ClientUpdateType.ADD,
            id: client.id,
            host: socket.remoteAddress
        }), true);

        socket.on("close", () => {
            console.log("[tls] lost", socket.remoteAddress);
            this.clients.splice(this.clients.indexOf(client), 1);

            ControlSocketServer.broadcast(new ClientMessage({
                type: ClientUpdateType.REMOVE,
                id: client.id
            }), true);
        });

        this.clients.push(client);
    }
}

export default ClientServer;
