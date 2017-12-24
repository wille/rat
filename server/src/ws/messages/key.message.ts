import Message from '../../../../shared/src/messages';
import { KeyTemplate } from '../../../../shared/src/templates/key';
import { MessageType } from '../../../../shared/src/types';

export default class KeyMessage extends Message<KeyTemplate> {

  constructor(message: KeyTemplate) {
    super(MessageType.Key, message);
  }
}
