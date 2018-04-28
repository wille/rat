import { DirectoryContentTemplate } from '@templates';
import store from '../';
import { setFilesList } from '@app/actions';

export default (data: DirectoryContentTemplate) => {
  const folders = data.files.filter(file => file.directory);
  const files = data.files.filter(file => !file.directory);

  store.dispatch(setFilesList([...folders, ...files]));
};
