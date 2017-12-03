import Message from "../../../../shared/src/messages";
import { MessageType } from "../../../../shared/src/types";

export default class PingMessage extends Message<{}> {

    constructor() {
        super(MessageType.Ping, {});
    }
}
