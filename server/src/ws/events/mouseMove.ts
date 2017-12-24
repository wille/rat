import WebClient from '~/ws/webClient';

import { clientServer } from '../..';
import { MouseMotionTemplate } from '../../../../shared/src/templates/mouse';
import MouseMotionMessage from '../messages/mouseMove.message';
import { MessageHandler } from './index';

export default class MouseMotionHandler implements MessageHandler<MouseMotionTemplate> {

  public handle(client: WebClient, data: MouseMotionTemplate) {
    clientServer.getById(data, (c) => {
      c.send(new MouseMotionMessage(data));
    });
  }
}
