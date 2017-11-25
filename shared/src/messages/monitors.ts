import { MessageType } from "../types";
import Message, { MessageTemplate } from "./index";

export interface Monitor {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface MonitorsTemplate extends MessageTemplate {
    monitors: Monitor[];
}

export default class MonitorsMessage extends Message<MonitorsTemplate> {

    constructor(message: MonitorsTemplate) {
        super(MessageType.Monitors, message);
    }
}
