import { createAction } from 'redux-actions';
import { FileEntry } from 'shared/templates';
import { Action } from '../constants';

export const setFilesList = createAction<FileEntry[]>(Action.SET_FILE_LIST);

export const setCurrentDirectory = createAction<string>(
  Action.SET_CURRENT_DIRECTORY
);
