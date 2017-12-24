import Message from '../../../../shared/src/messages';
import { MouseTemplate } from '../../../../shared/src/templates/mouse';
import { MessageType } from '../../../../shared/src/types';

export default class MouseMessage extends Message<MouseTemplate> {

  constructor(message: MouseTemplate) {
    super(MessageType.Mouse, message);
  }
}
