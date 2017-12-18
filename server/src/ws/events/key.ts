import WebClient from "~/ws/webClient";

import { clientServer } from "../..";
import { KeyTemplate } from "../../../../shared/src/templates/key";
import KeyMessage from "../messages/key.message";
import { MessageHandler } from "./index";

export default class KeyHandler implements MessageHandler<KeyTemplate> {

    public handle(client: WebClient, data: KeyTemplate) {
        clientServer.getById(data, (c) => {
            c.send(new KeyMessage(data));
        });
    }
}
