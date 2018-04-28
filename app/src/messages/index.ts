import ControlSocket from '@app/control';
import Message from '@shared/messages/index';
import SubscribeMessage from '@shared/messages/subscribe';
import { MessageType } from '@shared/types';
import { MessageTemplate } from '@templates';

import store from '../index';

export default interface MessageHandler<T extends MessageTemplate> {
  emit(data: T): void;
}

export { default as ClientHandler } from './clients';
export { default as ScreenHandler } from './screen';
export { default as DirectoryContentHandler } from './directory';

interface Subscriber {
  _id: number;
  type: MessageType;
  listener: MessageHandler<any>;
}

export function emit(message: Message) {
  const clients = store
    .getState()
    .subscriptions.filter(event => event.type === message._type);
  console.log(message);
  clients.forEach(event => event.listener.emit(message));
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
