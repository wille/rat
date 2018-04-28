import ControlSocket from '@app/control';
import SubscribeMessage from '@shared/messages/subscribe';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SUB':
      ControlSocket.send(
        new SubscribeMessage({
          type: action.payload.type,
          subscribe: true,
        })
      );

      return [...state, action.payload];
    case 'UNSUB':
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
