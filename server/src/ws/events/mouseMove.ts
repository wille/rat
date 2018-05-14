import { MessageHandler } from '.';
import { clientServer } from '../..';
import { MouseMotionTemplate } from '../../../../shared/src/templates/mouse';
import { MouseMoveMessage } from '../messages';

export default class MouseMotionHandler
  implements MessageHandler<MouseMotionTemplate> {
  public handle(data: MouseMotionTemplate) {
    clientServer.getById(data, c => c.send(new MouseMoveMessage(data)));
  }
}
