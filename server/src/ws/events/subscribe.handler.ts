import WebClient from '~/ws/webClient';

import { MessageHandler } from '.';
import { SubscribeTemplate } from '../../../../shared/src/templates';

class EventHandler implements MessageHandler<SubscribeTemplate> {
  public handle(data: SubscribeTemplate, client: WebClient) {
    const index = client.subscribed.indexOf(data.type);
    if (data.subscribe && index === -1) {
      client.subscribed.push(data.type);
    } else if (!data.subscribe && index !== -1) {
      client.subscribed.splice(index, 1);
    }
  }
}

export default EventHandler;
