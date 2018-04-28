import { DirectoryContentTemplate } from '@templates';

export default (data: DirectoryContentTemplate) => {
  const folders = data.files.filter(file => file.directory);
  const files = data.files.filter(file => !file.directory);

  [...folders, ...files];
};
