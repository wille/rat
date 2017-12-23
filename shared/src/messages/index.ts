import MessageTemplate from "../templates/template";
import { MessageType } from "../types";

export default class Message<T extends MessageTemplate = any> {

    constructor(public readonly _type: MessageType,
                public readonly data: T) {

    }
}
