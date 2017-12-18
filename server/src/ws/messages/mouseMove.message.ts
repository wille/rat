import Message from "../../../../shared/src/messages";
import { MouseMotionTemplate } from "../../../../shared/src/templates/mouse";
import { MessageType } from "../../../../shared/src/types";

export default class MouseMotionMessage extends Message<MouseMotionTemplate> {

    constructor(message: MouseMotionTemplate) {
        super(MessageType.Directory, message);
    }
}
