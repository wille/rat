import { MessageType } from '../messages/types';
import { MessageTemplate } from '../types';

export interface Message<T = any> {
  readonly _type: MessageType;
  readonly type: any;
  readonly data: T;
  _id?: number;
}

export function createMessage<T>(_type: MessageType) {
  return class implements Message<T> {
    readonly _type: MessageType;
    readonly type: any;
    readonly data: T;
    _id?: number;

    constructor(data: T) {
      this._type = _type;
      this.type = _type;
      this.data = data;
    }
  };
}
