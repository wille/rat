import { BrowseTemplate, MessageTemplate, ProcessTemplate, ScreenTemplate, SubscribeTemplate, KeyTemplate, MouseTemplate, MouseMotionTemplate } from './templates';
import { MessageType } from './types';

export interface Message<T extends MessageTemplate = any> {
  readonly _type: MessageType,
  readonly data: T
}

function createMessage<T extends MessageTemplate>(_type: MessageType) {
  return class implements Message<T> {
    readonly _type: MessageType;
    readonly data: T;

    constructor(data: T) {
      this._type = _type;
      this.data = data;
    }
  }
}

export const BrowseMessage = createMessage<BrowseTemplate>(MessageType.Directory);
export const ProcessMessage = createMessage<ProcessTemplate>(MessageType.Process);
export const StreamMessage = createMessage<ScreenTemplate>(MessageType.Screen);
export const SubscribeMessage = createMessage<SubscribeTemplate>(MessageType.Subscribe);
export const KeyMessage = createMessage<KeyTemplate>(MessageType.Key);
export const MouseMessage = createMessage<MouseTemplate>(MessageType.Mouse);
export const MouseMoveMessage = createMessage<MouseMotionTemplate>(MessageType.MouseMove);
