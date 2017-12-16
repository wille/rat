import ProcessMessage from "../../../../shared/src/messages/process";
import WebClient from "~/ws/webClient";
import { clientServer } from "../..";

import { ProcessTemplate } from "../../../../shared/src/templates/process";
import { MessageHandler } from "./index";

export default class ProcessHandler implements MessageHandler<ProcessTemplate> {

    public handle(client: WebClient, data: ProcessTemplate) {
        clientServer.getById(data, (c) => {
            c.send(new ProcessMessage(data));
        });
    }
}
