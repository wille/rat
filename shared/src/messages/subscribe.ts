import SubscribeTemplate from "../templates/subscribe";
import { MessageType } from "../types";
import Message from "./index";

export default class SubscribeMessage extends Message<SubscribeTemplate> {

    constructor(message: SubscribeTemplate) {
        super(MessageType.Subscribe, message);
    }
}
