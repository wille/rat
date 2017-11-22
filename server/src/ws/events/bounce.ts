import Message from "shared/message";
import { MessageType } from "shared/types";
import { MessageHandler } from "~/ws/events";
import WebClient from "~/ws/webClient";

class TestHandler implements MessageHandler<any> {

    public handle(client: WebClient, data: any) {
        client.emit({
            _type: MessageType.Bounce,
            data: "pong"
        });
    }
}

export default TestHandler;
