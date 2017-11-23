import { ClientTemplate, ClientUpdateType } from "../../../shared/src/messages";

import Client from "../client";
import ControlSocket from "../control";
import MessageHandler from "./index";

class ClientHandler implements MessageHandler<ClientTemplate> {

    public emit(data: ClientTemplate) {
        console.log(data);

        const params = data.data;
        switch (data.type) {
            case ClientUpdateType.ADD:
                const client = new Client(data.id, params.flag, params.country, params.host, params.computerName,
                    params.osType, params.operatingSystem);

                ControlSocket.clients.push(client);
                break;
            case ClientUpdateType.UPDATE:
                break;
            case ClientUpdateType.REMOVE:
                ControlSocket.clients = ControlSocket.clients.filter((client) => {
                    return client.id !== data.id;
                });
                break;
        }
    }
}

export default ClientHandler;
