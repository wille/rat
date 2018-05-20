import { TransferTemplate } from 'shared/templates';
import { setTransferList } from '../actions';

import store from '../';

export default (data: TransferTemplate) => {
  console.log(data);
  store.dispatch(setTransferList(data));
};
