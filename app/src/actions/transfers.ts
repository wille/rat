import { createAction } from 'redux-actions';

import { TransferData } from 'shared/templates';
import { Action } from '../constants';

export const setTransferList = createAction<TransferData[]>(
  Action.TRANSFER_LIST
);
