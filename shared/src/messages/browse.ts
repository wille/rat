import Message from "../../../shared/src/messages/index";
import { MessageType } from "../../../shared/src/types";
import { BrowseTemplate } from "../templates";

export default class BrowseMessage extends Message<BrowseTemplate> {

    constructor(message: BrowseTemplate) {
        super(MessageType.Directory, message);
    }
}
