import { TransferTemplate } from 'shared/templates';
import { setTransferList } from '../actions';

import store from '../';

export default (data: TransferTemplate) => {
  store.dispatch(setTransferList(data));
};
