import { createAction } from 'redux-actions';

import { TransferData } from 'shared/templates';
import { Action } from '../constants';

export const setTransferList = createAction<TransferData>(
  Action.TRANSFER_UPDATE
);

export const createPlaceholderTransfer = createAction<TransferData>(
  Action.TRANSFER_CREATE_PLACEHOLDER
);
