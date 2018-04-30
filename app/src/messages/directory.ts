import { setFilesList } from '@app/actions';
import { selectCurrentDirectory } from '@app/reducers';
import { DirectoryContentTemplate } from '@templates';
import store from '../';

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
