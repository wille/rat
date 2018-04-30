import * as path from 'path';

export const requireFileIcon = (name: string, isDir?: boolean) => {
  let type = 'file';

  if (isDir) {
    type = 'folder';
  } else {
    const ext = path.extname(name);

    switch (ext) {
      case '.zip':
      case '.tar':
      case '.gz':
        type = 'archive';
        break;
      case '.js':
      case '.sh':
      case '.bash':
        type = 'script';
        break;
      case '.bat':
      case '.cmd':
      case '.exe':
      case '.jar':
        type = 'application';
        break;
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
        type = 'image';
        break;
      default:
        type = 'file';
        break;
    }
  }

  return require('@assets/files/' + type + '.png');
};
