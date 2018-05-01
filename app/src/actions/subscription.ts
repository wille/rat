import { MessageType } from 'shared/types';
import { Action } from '../constants';

type HandlerFunc = (data?: any) => void;

export const subscribe = (type: MessageType, handler: HandlerFunc) => ({
  type: Action.SUBSCRIBE,
  payload: {
    type,
    handler,
  },
});

export const unsubscribe = (handler: HandlerFunc) => ({
  type: Action.UNSUBSCRIBE,
  payload: {
    handler,
  },
});
