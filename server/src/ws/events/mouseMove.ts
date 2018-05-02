import { MessageHandler } from '.';
import { clientServer } from '../..';
import { MouseMotionTemplate } from '../../../../shared/src/templates/mouse';
import MouseMotionMessage from '../messages/mouseMove.message';

export default class MouseMotionHandler
  implements MessageHandler<MouseMotionTemplate> {
  public handle(data: MouseMotionTemplate) {
    clientServer.getById(data, c => c.send(new MouseMotionMessage(data)));
  }
}
