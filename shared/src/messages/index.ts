import { MessageType } from "../types";
import MessageTemplate from "../templates/index";

export default class Message<T extends MessageTemplate = any> {

    constructor(public readonly _type: MessageType,
                public readonly data: T) {

    }
}
