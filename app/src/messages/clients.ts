import { ObjectId } from "bson";
import Message from "shared/messages/index";
import Client from "../client";
import ControlSocket from "../control";
import MessageHandler from "./index";

const enum ClientUpdateType {
    // Add client, on server connect or web panel open
    ADD = 0,

    // Update client data
    UPDATE = 1,

    // Remove client
    REMOVE = 2
}

interface ClientMessage extends Message {

    type: ClientUpdateType;
    id: ObjectId;
    data: {
        ping: number;
        flag?: string;
        country?: string;
        host?: string;
        computerName?: string;
        osType?: string;
        operatingSystem?: string;
    };
}

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
