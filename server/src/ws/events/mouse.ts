import { MessageHandler } from '.';
import { clientServer } from '../..';
import { MouseTemplate } from '../../../../shared/src/templates/mouse';
import { MouseMessage } from '../messages';

export default class MouseHandler implements MessageHandler<MouseTemplate> {
  public handle(data: MouseTemplate) {
    clientServer.getById(data, c => c.send(new MouseMessage(data)));
  }
}
