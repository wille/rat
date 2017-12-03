import { clientServer } from "../..";
import { ScreenTemplate } from "../../../../shared/src/messages/index";
import ScreenMessage from "../../../../shared/src/messages/screen";
import WebClient from "../webClient";
import { MessageHandler } from "./index";

class ScreenHandler implements MessageHandler<ScreenTemplate> {

    public handle(client: WebClient, data: ScreenTemplate) {
        clientServer.getById(data.id).send(new ScreenMessage(data));
    }
}

export default ScreenHandler;
