import { MessageType } from "../types";
import Message from "./index";

export enum ClientUpdateType {
    // Add client, on server connect or web panel open
    ADD = 0,

    // Update client data
    UPDATE = 1,

    // Remove client
    REMOVE = 2
}

interface ClientMessage extends Message {
    _type: MessageType.Client;

    type: ClientUpdateType;
    id: number;
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

export default ClientMessage;
