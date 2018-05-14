import { setProcessList } from '..//actions/processes';
import { ProcessListTemplate } from 'shared/templates';
import store from '../';

export default (data: ProcessListTemplate) => {
  store.dispatch(
    setProcessList(data.processes.sort((a, b) => (a.path === '' ? 1 : -1)))
  );
};
