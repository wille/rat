import SubscribeMessage from '@shared/messages/subscribe';

interface SubscribeAction {}

export const subscribe = (type, handler) => ({
  type: 'SUB',
  payload: {
    type,
    handler,
  },
});

export const unsubscribe = handler => ({
  type: 'UNSUB',
  payload: {
    handler,
  },
});
