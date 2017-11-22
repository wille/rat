import { BSON } from "bson";
import { TLSSocket } from "tls";
import { handle } from "./packets";

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
            let buffer = await this.read(2);
            const header = buffer.readInt16LE(0);

            buffer = await this.read(4);
            const size = buffer.readInt32LE(0);

            buffer = await this.read(size);
            const data = new BSON().deserialize(buffer);

            handle(this, {
                _type: header,
                ...data
            });
        }
    }
}

export default Client;
