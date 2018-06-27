import * as React from 'react';

import { UserOperatingSystem } from 'shared/system';
import { getOperatingSystemIcon } from '../../icons-utils';
import Spinner from '../Spinner';

interface Props {
  os: UserOperatingSystem;
  [x: string]: any;
}

const OsIcon = ({ os, ...props }: Props) => (
  <Spinner {...props} src={os.display && getOperatingSystemIcon(os)} />
);

export default OsIcon;
