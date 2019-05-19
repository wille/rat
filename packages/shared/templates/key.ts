import { InputState } from '../display';
import MessageTemplate from './template';

export interface KeyTemplate extends MessageTemplate {
  keyCode: number;
  state: InputState;
}
