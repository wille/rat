import { Action } from '../constants';
import { FileEntry } from '@shared/templates';

export const setFilesList = (list: FileEntry[]) => ({
  type: Action.SET_FILE_LIST,
  payload: list,
});
