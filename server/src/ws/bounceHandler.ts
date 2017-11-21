import Message from "shared/message";
import { MessageType } from "shared/types";
import { MessageHandler } from "./handler";
import WebClient from "./webClient";

class TestHandler implements MessageHandler<any> {

    public handle(client: WebClient, data: any) {
        console.log("bounce", data);
        client.emit({
            _type: MessageType.Bounce,
            data: "pong"
        });
    }
}

export default TestHandler;
