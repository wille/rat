import { TransferData } from 'shared/templates';
import { Action } from '../constants';

const initialState: TransferData[] = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.TRANSFER_UPDATE:
      const index = state.findIndex(data => data.id.equals(action.payload.id));
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
