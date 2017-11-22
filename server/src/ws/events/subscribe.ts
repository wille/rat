import Message, { SubscribeMessage } from "shared/messages";
import { MessageType } from "shared/types";
import WebClient from "~/ws/webClient";
import { MessageHandler } from "./index";

class EventHandler implements MessageHandler<SubscribeMessage> {

    public handle(client: WebClient, data: SubscribeMessage) {
        const index = client.subscribed.indexOf(data.type);
        if (data.subscribe && index === -1) {
            client.subscribed.push(data.type);
        } else if (!data.subscribe && index !== -1) {
            client.subscribed.splice(index, 1);
        }
    }
}

export default EventHandler;
