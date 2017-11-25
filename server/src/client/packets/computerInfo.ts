import { MessageType } from "shared/types";
import { PacketHandler } from "~/client/packets";

import ClientProperties from "../../../../shared/src/clientProperties";
import { MessageTemplate } from "../../../../shared/src/messages";
import ClientMessage, { ClientUpdateType } from "../../../../shared/src/messages/client";
import ControlSocketServer from "../../controlSocketServer";
import Client from "../client";

type ComputerInfoTemplate = MessageTemplate & ClientProperties;

class ComputerInfoHandler implements PacketHandler<ComputerInfoTemplate> {

    public handle(client: Client, data: ComputerInfoTemplate) {
        data._type = MessageType.Client;

        ControlSocketServer.broadcast(new ClientMessage({
            type: ClientUpdateType.UPDATE,
            id: client.id,
            computerName: data.username,
            flag: "unknown",
            country: "Country",
        }), true);
    }
}

export default ComputerInfoHandler;
