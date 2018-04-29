import ControlSocket from '@app/control';
import Message from '@shared/messages/index';
import SubscribeMessage from '@shared/messages/subscribe';
import { MessageType } from '@shared/types';
import { MessageTemplate } from '@templates';
import withProps from 'recompose/withProps';
import store from '../index';

export function emit(message: Message) {
  const clients = store
    .getState()
    .subscriptions.filter(event => event.type === message._type);
  clients.forEach(event => {
    event.handler(message);
  });
}

export function publishSubscriptions() {
  store.getState().subscriptions.forEach(event => {
    ControlSocket.send(
      new SubscribeMessage({
        type: event.type,
        subscribe: true,
      })
    );
  });
}
