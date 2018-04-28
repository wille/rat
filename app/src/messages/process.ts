import { ProcessListTemplate } from '@templates';

export default (data: ProcessListTemplate) =>
  data.processes.sort((a, b) => (a.path === '' ? 1 : -1));
