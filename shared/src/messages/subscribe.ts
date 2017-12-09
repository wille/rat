import { MessageType } from "@shared/types";
import SubscribeTemplate from "@templates/subscribe";

import Message from "./index";

export default class SubscribeMessage extends Message<SubscribeTemplate> {

    constructor(message: SubscribeTemplate) {
        super(MessageType.Subscribe, message);
    }
}
