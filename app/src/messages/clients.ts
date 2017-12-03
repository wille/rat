import ClientTemplate, { ClientUpdateType } from "../../../shared/src/templates/client";
import Client from "../client";
import { Connections } from "../components/clientlist";
import ControlSocket from "../control";
import MessageHandler from "./index";

class ClientHandler implements MessageHandler<ClientTemplate> {

    constructor(private view: Connections) {

    }

    public emit(data: ClientTemplate) {
        console.log(data);

        switch (data.type) {
            case ClientUpdateType.ADD:
                const client = new Client(data.id, data.host);
                client.update(data);
                ControlSocket.clients.push(client);
                break;
            case ClientUpdateType.UPDATE:
                ControlSocket.clients.filter((client) => {
                    if (client.id === data.id) {
                        return client;
                    }
                }).forEach((client) => {
                    client.update(data);
                });
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
