import { TransferListTemplate } from 'shared/templates';
import { setTransferList } from '../actions';

import store from '../';

export default (data: TransferListTemplate) => {
  store.dispatch(setTransferList(data.transfers));
};
