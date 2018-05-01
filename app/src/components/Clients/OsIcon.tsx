import { getOperatingSystemIcon } from '@app/icons-utils';
import StaticImage from '@components/Clients/StaticImage';
import * as React from 'react';
import { UserOperatingSystem } from 'shared/system';

interface Props {
  os: UserOperatingSystem;
}

const OsIcon = ({ os }: Props) => (
  <StaticImage size="16px" src={getOperatingSystemIcon(os)} />
);

export default OsIcon;
