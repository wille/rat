import { MessageType } from "shared/types";
import { PacketHandler } from "~/client/packets";

import { MessageTemplate } from "../../../../shared/src/messages";
import ClientMessage, { ClientUpdateType } from "../../../../shared/src/messages/client";
import { ClientProperties } from "../../../../shared/src/system";
import ControlSocketServer from "../../controlSocketServer";
import Client from "../client";

type ComputerInfoTemplate = MessageTemplate & ClientProperties;

class ComputerInfoHandler implements PacketHandler<ComputerInfoTemplate> {

    public handle(client: Client, data: ComputerInfoTemplate) {
        client.hostname = data.hostname;
        client.username = data.username;
        client.monitors = data.monitors;
        client.os = data.os;

        ControlSocketServer.broadcast(new ClientMessage({
            type: ClientUpdateType.UPDATE,
            ...client.getSystemProperties()
        }), true);
    }
}

export default ComputerInfoHandler;
