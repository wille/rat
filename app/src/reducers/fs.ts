import { Action } from '../constants';

const initialState = {
  list: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.SET_FILE_LIST:
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};

export const selectFilesList = state => state.fs.list;
