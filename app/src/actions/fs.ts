import { FileEntry } from '@shared/templates';
import { Action } from '../constants';

export const setFilesList = (list: FileEntry[]) => ({
  type: Action.SET_FILE_LIST,
  payload: list,
});

export const setCurrentDirectory = (path: string) => ({
  type: Action.SET_CURRENT_DIRECTORY,
  payload: path,
});
