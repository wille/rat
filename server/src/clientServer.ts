import * as fs from "fs";
import * as tls from "tls";
import Client from "./client";

class ClientServer {

    private server: tls.Server;
    private clients: Client[] = [];

    constructor(port: number) {
        const options = {
            cert: fs.readFileSync("cert.pem"),
            key: fs.readFileSync("private.pem"),
            rejectUnauthorized: false,
            requestCert: true
        };
        console.log("created server");

        this.server = tls.createServer(options, (socket) => this.onConnection(socket));
        this.server.listen(port);
    }

    private onConnection(socket: tls.TLSSocket) {
        const client = new Client(socket);
        socket.on("close", () => {
            console.log("socket closed");
            this.clients.splice(this.clients.indexOf(client), 1);
        });

        this.clients.push(client);
    }
}

export default ClientServer;
