import { InputState, MouseButton } from './display';
import MessageTemplate from './template';

export interface MouseTemplate extends MessageTemplate {
  monitorId: number;
  button: MouseButton;
  state: InputState;
}

export interface MouseMotionTemplate extends MessageTemplate {
  monitorId: number;
  x: number;
  y: number;
}
