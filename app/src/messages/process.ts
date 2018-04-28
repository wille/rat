import { ProcessListTemplate } from '@templates';
import { setProcessList } from '@app/actions/processes';
import store from '../';

export default (data: ProcessListTemplate) => {
  store.dispatch(setProcessList(data.processes.sort((a, b) => (a.path === '' ? 1 : -1))));
};
