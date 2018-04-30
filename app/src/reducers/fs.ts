import { FileEntry } from '@shared/templates';
import { Action } from '../constants';

interface State {
  list: FileEntry[];
}

const initialState: State = {
  list: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.SET_FILE_LIST:
      console.log(action.payload);
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};

export const selectFilesList = state => state.fs.list;
