import { TransferData } from 'shared/templates';
import { Action } from '../constants';

const initialState: TransferData[] = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.TRANSFER_UPDATE:
      return [...state, action.payload];
    case Action.TRANSFER_CREATE_PLACEHOLDER: {
      return [...state, action.payload];
    }
    default:
      return state;
  }
};

export const selectTransferList = state => state.transfers;
