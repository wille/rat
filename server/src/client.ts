import { BSON } from "bson";
import { TLSSocket } from "tls";

class Client {

    private current: Buffer;
    private curr: number;

    constructor(private readonly socket: TLSSocket) {
        this.loop();
    }

    /**
     * Read n bytes from the socket and resolve when complete
     * @param n
     */
    private async read(n: number) {
        return new Promise<Buffer>((resolve, reject) => {
            const buffer = this.socket.read(n);
            if (buffer === null) {
                this.socket.once("readable", () => this.read(n).then(resolve).catch(reject));
                return;
            }

            resolve(buffer);
        });
    }

    private async loop() {
        while (true) {
            let header: any = await this.read(2);
            header = header.readInt16LE(0);
            console.log(header);

            let size: any = await this.read(4);
            size = size.readInt32LE(0);

            let bson: any = await this.read(size);
            bson = new BSON().deserialize(bson);

            console.log(bson);
        }
    }
}

export default Client;
