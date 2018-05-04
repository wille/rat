import { getOperatingSystemIcon } from '@app/icons-utils';
import Spinner from '@components/Spinner';
import * as React from 'react';
import { UserOperatingSystem } from 'shared/system';

interface Props {
  os: UserOperatingSystem;
  [x: string]: any;
}

const OsIcon = ({ os, ...props }: Props) => (
  <Spinner
    {...props}
    size="36px"
    src={os.display && getOperatingSystemIcon(os)}
  />
);

export default OsIcon;
