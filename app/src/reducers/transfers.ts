import { Transfer } from 'src/messages/transfers';
import { Action } from '../constants';

const initialState: Transfer[] = [];

export default (state = initialState, action) => {
  console.log(action.payload);
  switch (action.type) {
    case Action.TRANSFER_UPDATE:
      const index = state.findIndex(data => data.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
      return [...state];
    case Action.TRANSFER_CREATE_PLACEHOLDER: {
      return [...state, action.payload];
    }
    default:
      return state;
  }
};

export const selectTransferList = state => state.transfers;
