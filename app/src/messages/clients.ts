import ClientMessage, { ClientUpdateType } from "../../../shared/src/messages/client";

import Client from "../client";
import ControlSocket from "../control";
import MessageHandler from "./index";

class ClientHandler implements MessageHandler<ClientMessage> {

    public emit(data: ClientMessage) {
        console.log(data);
        let client: Client;

        const params = data.data;
        switch (data.type) {
            case ClientUpdateType.ADD:
                client = new Client(data.id, params.flag, params.country, params.host, params.computerName,
                    params.osType, params.operatingSystem);

                ControlSocket.clients.push(client);
                break;
            case ClientUpdateType.UPDATE:
                break;
            case ClientUpdateType.REMOVE:
                console.log("remove");
                break;
        }
    }
}

export default ClientHandler;
