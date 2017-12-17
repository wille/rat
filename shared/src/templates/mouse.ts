import { InputState, MouseButton } from "../display";

export interface MouseTemplate {
    monitorId: number;
    button: MouseButton;
    state: InputState;
}
