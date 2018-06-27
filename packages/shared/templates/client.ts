import { ClientProperties } from "../system";
import MessageTemplate from "./template";

export enum ClientUpdateType {
  // Add client, on server connect or web panel open
  ADD,

  // Update client data
  UPDATE,

  // Remove client
  REMOVE
}

export interface ClientTemplate extends ClientProperties, MessageTemplate {
  type: ClientUpdateType;
  initial?: true;
}
