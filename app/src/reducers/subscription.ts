import ControlSocket from '@app/control';
import SubscribeMessage from '@shared/messages/subscribe';

const initialState = [];

export default (state = initialState, action) => {
  const { type, handler } = action.payload;

  switch (action.type) {
    case 'SUB':
      ControlSocket.send(
        new SubscribeMessage({
          type,
          subscribe: true,
        })
      );

      return [...state, action.payload];
    case 'UNSUB':
      ControlSocket.send(
        new SubscribeMessage({
          type,
          subscribe: false,
        })
      );
      return state.filter(sub => sub !== handler);
    default:
      return state;
  }
};
