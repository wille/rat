import { MessageType } from "../types";
import Message, { MessageTemplate } from "./index";

class PingMessage extends Message<{}> {

    constructor() {
        super(MessageType.Ping, {});
    }
}

export default PingMessage;
