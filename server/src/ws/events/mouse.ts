import WebClient from '~/ws/webClient';

import { clientServer } from '../..';
import { MouseTemplate } from '../../../../shared/src/templates/mouse';
import MouseMessage from '../messages/mouse.message';
import { MessageHandler } from './index';

export default class MouseHandler implements MessageHandler<MouseTemplate> {

  public handle(client: WebClient, data: MouseTemplate) {
    clientServer.getById(data, (c) => {
      c.send(new MouseMessage(data));
    });
  }
}
