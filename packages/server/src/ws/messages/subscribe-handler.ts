import WebClient from '../../ws/webClient';

import { SubscribeTemplate } from 'shared/templates';

export default (data: SubscribeTemplate, client: WebClient) => {
  const index = client.subscribed.indexOf(data.type);
  if (data.subscribe && index === -1) {
    client.subscribed.push(data.type);
  } else if (!data.subscribe && index !== -1) {
    client.subscribed.splice(index, 1);
  }
};
