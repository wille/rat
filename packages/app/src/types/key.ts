import { InputState } from '../../../shared/display';
import MessageTemplate from './template';

export interface KeyTemplate extends MessageTemplate {
  keyCode: number;
  state: InputState;
}
