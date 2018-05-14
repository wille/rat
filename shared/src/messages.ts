import { MessageTemplate} from './templates';
import { MessageType } from './types';

export interface Message<T extends MessageTemplate = MessageTemplate> {
  readonly _type: MessageType,
  readonly data: T
}

export function createMessage<T extends MessageTemplate>(_type: MessageType) {
  return class implements Message<T> {
    readonly _type: MessageType;
    readonly data: T;

    constructor(data: T) {
      this._type = _type;
      this.data = data;
    }
  }
}
