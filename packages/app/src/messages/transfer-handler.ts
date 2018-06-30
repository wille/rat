import { TransferTemplate } from 'shared/templates';
import { setTransferList } from '../actions';

import store from '../';
import Transfer from '../lib/transfer';

export default (data: TransferTemplate) => {
  store.dispatch(setTransferList(new Transfer(data)));
};
