import { Action } from '../constants';

const initialState = {
  list: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.TRANSFER_LIST:
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};

export const selectTransferList = state => state.transfers.list;
