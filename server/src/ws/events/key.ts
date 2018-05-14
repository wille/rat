import { MessageHandler } from '.';
import { clientServer } from '../..';
import { KeyTemplate } from '../../../../shared/src/templates/key';
import { KeyMessage } from '../messages';

export default class KeyHandler implements MessageHandler<KeyTemplate> {
  public handle(data: KeyTemplate) {
    clientServer.getById(data, c => c.send(new KeyMessage(data)));
  }
}
