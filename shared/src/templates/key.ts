import { InputState } from "../display";
import MessageTemplate from "./index";

export interface KeyTemplate extends MessageTemplate {
    keyCode: number;
    state: InputState;
}
