import { MessageType } from "../types";

export interface BaseTemplate<T> {
  _type?: T;
}

export default interface MessageTemplate extends BaseTemplate<MessageType> {
  _id?: string;
  [key: string]: any;
}
