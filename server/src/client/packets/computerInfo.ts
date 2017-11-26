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
        ControlSocketServer.broadcast(new ClientMessage({
            type: ClientUpdateType.UPDATE,
            id: client.id,
            hostname: data.hostname,
            username: data.username,
            monitors: data.monitors
        }), true);
    }
}

export default ComputerInfoHandler;
