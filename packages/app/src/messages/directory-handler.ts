import { DirectoryContentTemplate } from 'shared/templates';
import store from '../';
import { setFilesList } from '..//actions';
import { selectCurrentDirectory } from '..//reducers';

export default (data: DirectoryContentTemplate) => {
  console.log('directory data', data);
  store.dispatch(
    setFilesList(
      data.sort((a, b) => +b.directory - +a.directory).map(file => ({
        ...file,
        path: selectCurrentDirectory(store.getState()),
      }))
    )
  );
};
