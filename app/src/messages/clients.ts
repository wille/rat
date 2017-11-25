import { ClientTemplate, ClientUpdateType } from "../../../shared/src/messages";
import Client from "../client";
import ConnectionsComponent from "../components/connections";
import ControlSocket from "../control";
import MessageHandler from "./index";

class ClientHandler implements MessageHandler<ClientTemplate> {

    constructor(private view: ConnectionsComponent) {

    }

    public emit(data: ClientTemplate) {
        console.log(data);

        switch (data.type) {
            case ClientUpdateType.ADD:
                const client = new Client(data.id, data.flag, data.country, data.host, data.computerName,
                    data.osType, data.operatingSystem);

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

        this.view.setState({
            clients: ControlSocket.clients
        });
    }
}

export default ClientHandler;
