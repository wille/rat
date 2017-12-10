import { clientServer } from "../..";
import BrowseMessage from "../../../../shared/src/messages/browse";
import BrowseTemplate from "../../../../shared/src/templates/browse";
import WebClient from "../webClient";
import { MessageHandler } from "./index";

export default class BrowseHandler implements MessageHandler<BrowseTemplate> {

    public handle(client: WebClient, data: BrowseTemplate) {
        clientServer.getById(data.id, (c) => {
            c.send(new BrowseMessage(data));
        });
    }
}
