import Message from "../../../shared/src/messages/index";
import { MessageType } from "../../../shared/src/types";
import { ScreenTemplate } from "../templates";

export default class StreamMessage extends Message<ScreenTemplate> {

    constructor(message: ScreenTemplate) {
        super(MessageType.Screen, message);
    }
}
