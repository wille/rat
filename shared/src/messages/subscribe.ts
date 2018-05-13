import { MessageType } from "shared/types";
import { SubscribeTemplate } from "shared/templates";

import Message from "./index";

export default class SubscribeMessage extends Message<SubscribeTemplate> {

    constructor(message: SubscribeTemplate) {
        super(MessageType.Subscribe, message);
    }
}
