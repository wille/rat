import * as path from 'path';
import { UserOperatingSystem } from 'shared/system';

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

export const getOperatingSystemIcon = (os: UserOperatingSystem) => {
  let name = 'unknown';

  if (os.display) {
    const args = os.display.split(' ');
    const type = args[0].toLowerCase();
    const version = args.length >= 2 ? args[args.length - 1] : null;

    switch (type) {
      case 'windows':
      case 'linux':
      case 'debian':
      case 'ubuntu':
      case 'opensuse':
      case 'mint':
      case 'gentoo':
      case 'fedora':
      case 'centos':
      case 'arch':
      case 'kali':
      case 'freebsd':
      case 'openbsd':
      case 'netbsd':
      case 'dragonfly':
        name = type;
        break;
      case 'mac': // Mac OS X
      case 'macos':
        name = 'macos';
        break;
      default:
        name = 'unknown';
        break;
    }
  }

  return require('@assets/os/' + name + '.svg');
};
