import Message from "shared/message";
import { MessageType } from "shared/types";
import { MessageHandler } from "./handler";

import ControlSocket from "../control";

class TestHandler implements MessageHandler<any> {

    public handle(data: any) {
        console.log("bounce", data);
    }
}

export default TestHandler;
