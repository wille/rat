import * as React from 'react';
import Client from '../../client';
import StaticImage from './StaticImage';

interface Props {
  client: Client;
}

const FlagIcon = ({ client }: Props) => {
  const fileName = client.flag || '_unknown';
  const flag = require('flag-icons/flags/flags-iso/flat/24/' +
    fileName +
    '.png');

  return <StaticImage size="24px" src={flag} />;
};

export default FlagIcon;
