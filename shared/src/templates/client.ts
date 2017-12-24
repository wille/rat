import { ClientProperties } from "../system";
import MessageTemplate from "./template";

export enum ClientUpdateType {
    // Add client, on server connect or web panel open
    ADD = 0,

    // Update client data
    UPDATE = 1,

    // Remove client
    REMOVE = 2
}

export interface ClientTemplate extends ClientProperties, MessageTemplate {
    type: ClientUpdateType;
}
