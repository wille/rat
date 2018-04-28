import ControlSocket from '@app/control';
import Message from '@shared/messages/index';
import SubscribeMessage from '@shared/messages/subscribe';
import { MessageType } from '@shared/types';
import { MessageTemplate } from '@templates';
import withProps from 'recompose/withProps';
import store from '../index';

import Handler from '../components/Handler';
import clientHandler from './clients';
import directoryHandler from './directory';
import processHandler from './process';
import screenHandler from './screen';

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

const ClientSubscription = withProps({
  type: MessageType.Client,
  handler: clientHandler,
})(Handler);

const DirectorySubscription = withProps({
  type: MessageType.Directory,
  handler: directoryHandler,
})(Handler);

const ScreenSubscription = withProps({
  type: MessageType.Screen,
  handler: screenHandler,
})(Handler);

const ProcessSubscription = withProps({
  type: MessageType.Process,
  handler: processHandler,
})(Handler);

export { ClientSubscription };
