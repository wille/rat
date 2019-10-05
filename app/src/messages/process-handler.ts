import { ProcessListTemplate } from 'app/types';
import store from '..';
import { setProcessList } from '../actions/processes';

export default (data: ProcessListTemplate) => {
  store.dispatch(setProcessList(data.sort((a, b) => (a.path === '' ? 1 : -1))));
};
