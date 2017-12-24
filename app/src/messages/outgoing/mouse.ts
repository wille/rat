import Message from '@shared/messages';
import { MessageType } from '@shared/types';
import { MouseMotionTemplate, MouseTemplate } from '@templates';

export class MouseMessage extends Message<MouseTemplate> {

  constructor(message: MouseTemplate) {
    super(MessageType.Mouse, message);
  }
}

export class MouseMotionMessage extends Message<MouseMotionTemplate> {

  constructor(message: MouseMotionTemplate) {
    super(MessageType.MouseMove, message);
  }
}
