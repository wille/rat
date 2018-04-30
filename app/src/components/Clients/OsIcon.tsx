import { getOperatingSystemIcon } from '@app/icons-utils';
import StaticImage from '@components/Clients/StaticImage';
import { OperatingSystem } from '@shared/system';
import * as React from 'react';

interface Props {
  os: OperatingSystem;
}

const OsIcon = ({ os }: Props) => (
  <StaticImage size="16px" src={getOperatingSystemIcon(os)} />
);

export default OsIcon;
