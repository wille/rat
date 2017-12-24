import Message from "../../../../shared/src/messages";
import { ClientTemplate } from "../../../../shared/src/templates";
import { MessageType } from "../../../../shared/src/types";

export default class ClientMessage extends Message<ClientTemplate> {

    constructor(message: ClientTemplate) {
        super(MessageType.Client, message);
    }
}
