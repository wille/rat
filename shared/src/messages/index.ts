import { MessageType } from "../types";

export default class Message<T = any> {

    constructor(public readonly _type: MessageType,
                public readonly data: T) {

    }
}
