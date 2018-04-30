import { FileEntry } from '@shared/templates';
import { Action } from '../constants';

interface State {
  list: FileEntry[];
  currentDirectory: string;
}

const initialState: State = {
  list: [],
  currentDirectory: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.SET_FILE_LIST:
      return {
        ...state,
        list: action.payload,
      };
    case Action.SET_CURRENT_DIRECTORY:
      return {
        ...state,
        currentDirectory: action.payload,
      };
    default:
      return state;
  }
};

export const selectFilesList = state => state.fs.list;
export const selectCurrentDirectory = state => state.fs.currentDirectory;
