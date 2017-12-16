import { ProcessTemplate } from "../templates/process";
import { MessageType } from "../types";
import Message from "./index";

export default class ProcessMessage extends Message<ProcessTemplate> {

    constructor(message: ProcessTemplate) {
        super(MessageType.Process, message);
    }
}
