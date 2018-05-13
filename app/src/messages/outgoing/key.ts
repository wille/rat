import Message from 'shared/messages';
import { MessageType } from 'shared/types';
import { KeyTemplate } from 'shared/templates';

export default class KeyMessage extends Message<KeyTemplate> {

  constructor(message: KeyTemplate) {
    super(MessageType.Key, message);
  }
}
