import { Action } from '@app/constants';
import { createAction } from 'redux-actions';
import { Process } from 'shared/templates';

export const setProcessList = createAction<Process[]>(Action.PROCESS_SET_LIST);
