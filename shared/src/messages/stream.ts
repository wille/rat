import Message from "../../../shared/src/messages/index";
import { MessageType } from "../../../shared/src/types";
import StreamTemplate from "../templates/screen";

export default class StreamMessage extends Message<StreamTemplate> {

    constructor(message: StreamTemplate) {
        super(MessageType.Screen, message);
    }
}
