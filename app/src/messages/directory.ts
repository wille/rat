import { DirectoryContentTemplate } from '@templates';

import MessageHandler from './index';

export default class DirectoryContentHandler
  implements MessageHandler<DirectoryContentTemplate> {
  public emit(data: DirectoryContentTemplate) {
    /*const folders = data.files.filter(file => file.directory);
    const files = data.files.filter(file => !file.directory);

    this.view.setState({
      files: [...folders, ...files],
    });*/
  }
}
