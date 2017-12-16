import Message from "../../../../shared/src/messages";
import { ProcessListTemplate } from "../../../../shared/src/templates/process";
import { MessageType } from "../../../../shared/src/types";

export default class ProcessListMessage extends Message<ProcessListTemplate> {

    constructor(message: ProcessListTemplate) {
        super(MessageType.Process, message);
    }
}
