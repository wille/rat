import { Message } from 'shared/messages';
import ControlSocket from '../control';
import { SubscribeMessage } from '../messages/outgoing-messages';

import store from '..';
import { selectSubscriptions } from '../reducers';

export const emit = (message: Message) =>
  store
    .getState()
    .subscriptions.filter(event => event.type === message._type)
    .forEach(event => event.handler(message));

export const publishSubscriptions = () =>
  selectSubscriptions(store.getState()).forEach(event =>
    ControlSocket.send(
      new SubscribeMessage({
        type: event.type,
        subscribe: true,
      })
    )
  );
