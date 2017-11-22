import Client from "../client";
import { PacketHandler } from "./index";

import { MessageType } from "shared/types";
import ControlSocketServer from "../../controlSocketServer";

class ComputerInfoHandler implements PacketHandler<any> {

    public handle(client: Client, data: any) {
        console.log(data);
        data._type = MessageType.Client;
        ControlSocketServer.broadcast(data);
    }
}

export default ComputerInfoHandler;
