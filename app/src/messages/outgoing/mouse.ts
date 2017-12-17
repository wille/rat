import Message from "@shared/messages";
import { MessageType } from "@shared/types";
import { MouseTemplate } from "@templates/mouse";

export default class MouseMessage extends Message<MouseTemplate> {

    constructor(message: MouseTemplate) {
        super(MessageType.Process, message);
    }
}
