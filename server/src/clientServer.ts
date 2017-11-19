import * as fs from "fs";
import * as tls from "tls";

class ClientServer {

    private server: tls.Server;

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

    }
}

export default ClientServer;
