import { ProcessListTemplate } from 'shared/templates';
import store from '../';
import { setProcessList } from '..//actions/processes';

export default (data: ProcessListTemplate) => {
  store.dispatch(
    setProcessList(data.processes.sort((a, b) => (a.path === '' ? 1 : -1)))
  );
};
