import { createAction } from 'redux-actions';
import { Process } from 'shared/templates';
import { Action } from '..//constants';

export const setProcessList = createAction<Process[]>(Action.PROCESS_SET_LIST);
