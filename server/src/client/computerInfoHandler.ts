import Client from "./client";
import { PacketHandler } from "./handler";

import ControlSocketServer from "../controlSocketServer";

class ComputerInfoHandler implements PacketHandler<any> {

    public handle(client: Client, data: any) {
        console.log(data);
        ControlSocketServer.broadcast(data);
    }
}

export default ComputerInfoHandler;
