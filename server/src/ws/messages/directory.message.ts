import Message from "../../../../shared/src/messages";
import { DirectoryContentTemplate } from "../../../../shared/src/templates";
import { MessageType } from "../../../../shared/src/types";

export default class DirectoryMessage extends Message<DirectoryContentTemplate> {

    constructor(message: DirectoryContentTemplate) {
        super(MessageType.Directory, message);
    }
}
