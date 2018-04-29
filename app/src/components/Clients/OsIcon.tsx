import StaticImage from '@components/Clients/StaticImage';
import { OperatingSystem } from '@shared/system';
import * as React from 'react';

interface Props {
  os: OperatingSystem;
}

const getIconName = (os: OperatingSystem) => {
  if (!os.display) {
    return 'unknown';
  }

  const args = os.display.split(' ');
  const type = args[0].toLowerCase();
  const version = args.length >= 2 ? args[args.length - 1] : null;

  switch (type) {
    case 'windows':
    case 'linux':
      return 'os_' + type;
    case 'mac': // Mac OS X
    case 'macos':
      return 'os_mac';
    case 'debian':
    case 'ubuntu':
    case 'opensuse':
    case 'mint':
    case 'gentoo':
    case 'fedora':
    case 'centos':
    case 'arch':
    case 'kali':
      return 'dist_' + type;
    default:
      return 'unknown';
  }
};

const OsIcon = ({ os }: Props) => {
  const { display } = os;

  const src = require('@assets/os/' + getIconName(os) + '.png');

  return <StaticImage size="16px" src={src} />;
};

export default OsIcon;
