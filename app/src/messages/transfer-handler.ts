import { setTransferList } from '../actions';

import store from '..';
import { Transfer } from './transfers';

export default (data: Transfer) => {
  store.dispatch(setTransferList(data));
};
