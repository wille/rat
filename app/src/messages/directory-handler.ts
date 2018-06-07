import { DirectoryContentTemplate } from 'shared/templates';
import store from '../';
import { setFilesList } from '..//actions';
import { selectCurrentDirectory } from '..//reducers';

export default (data: DirectoryContentTemplate) => {
  store.dispatch(
    setFilesList(
      data.files.sort((a, b) => +b.directory - +a.directory).map(file => ({
        ...file,
        path: selectCurrentDirectory(store.getState()),
      }))
    )
  );
};
