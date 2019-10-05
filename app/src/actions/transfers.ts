import { createAction } from 'redux-actions';

import { Transfer } from 'src/messages/transfers';
import { Action } from '../constants';

export const setTransferList = createAction<Transfer>(Action.TRANSFER_UPDATE);

export const createPlaceholderTransfer = createAction<Transfer>(
  Action.TRANSFER_CREATE_PLACEHOLDER
);
