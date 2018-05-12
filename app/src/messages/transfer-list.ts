import { setTransferList } from '@app/actions';
import { TransferListTemplate } from '@templates';

import store from '../';

export default (data: TransferListTemplate) => {
  store.dispatch(setTransferList(data.transfers));
};
