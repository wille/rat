import ControlSocket from '@app/control';
import SubscribeMessage from '@shared/messages/subscribe';
import { Action } from '../constants';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.SUBSCRIBE:
      ControlSocket.send(
        new SubscribeMessage({
          type: action.payload.type,
          subscribe: true,
        })
      );

      return [...state, action.payload];
    case Action.UNSUBSCRIBE:
      ControlSocket.send(
        new SubscribeMessage({
          type: action.payload.type,
          subscribe: false,
        })
      );
      return state.filter(sub => sub !== action.payload.handler);
    default:
      return state;
  }
};
