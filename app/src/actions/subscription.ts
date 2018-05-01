import { createAction } from 'redux-actions';
import { MessageType } from 'shared/types';
import { Action } from '../constants';

type HandlerFunc = (data?: any) => void;

export const subscribe = createAction<any, MessageType, HandlerFunc>(
  Action.SUBSCRIBE,
  (type, handler) => ({
    type,
    handler,
  })
);

export const unsubscribe = createAction<HandlerFunc>(Action.UNSUBSCRIBE);
