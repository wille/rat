import { getOperatingSystemIcon } from '@app/icons-utils';
import Spinner from '@components/Spinner';
import * as React from 'react';
import { UserOperatingSystem } from 'shared/system';

interface Props {
  os: UserOperatingSystem;
}

const OsIcon = ({ os }: Props) => (
  <Spinner size="16px" src={os.display && getOperatingSystemIcon(os)} />
);

export default OsIcon;
