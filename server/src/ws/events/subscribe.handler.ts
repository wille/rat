import WebClient from "~/ws/webClient";

import { SubscribeTemplate } from "../../../../shared/src/templates";
import { MessageHandler } from "./index";

class EventHandler implements MessageHandler<SubscribeTemplate> {

    public handle(client: WebClient, data: SubscribeTemplate) {
        const index = client.subscribed.indexOf(data.type);
        if (data.subscribe && index === -1) {
            client.subscribed.push(data.type);
        } else if (!data.subscribe && index !== -1) {
            client.subscribed.splice(index, 1);
        }
    }
}

export default EventHandler;
