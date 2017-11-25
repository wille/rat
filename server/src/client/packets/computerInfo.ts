import { MessageType } from "shared/types";
import { PacketHandler } from "~/client/packets";

import ClientMessage, { ClientUpdateType } from "../../../../shared/src/messages/client";
import { MessageTemplate } from "../../../../shared/src/messages/index";
import ControlSocketServer from "../../controlSocketServer";
import Client from "../client";

interface ComputerInfoTemplate extends MessageTemplate {
    hostname: string;
    operatingsystemdisplayname: string;
    operatingsystemname: string;
    username: string;
}

class ComputerInfoHandler implements PacketHandler<ComputerInfoTemplate> {

    public handle(client: Client, data: ComputerInfoTemplate) {
        data._type = MessageType.Client;

        ControlSocketServer.broadcast(new ClientMessage({
            type: ClientUpdateType.ADD,
            id: client.id,
            host: client.remoteAddress,
            computerName: data.username
        }), true);
    }
}

export default ComputerInfoHandler;
