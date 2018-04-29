import * as React from 'react';
import StaticImage from './StaticImage';

interface Props {
  ping: number;
}

const PingIcon = ({ ping }: Props) => {
  const steps = [100, 150, 250, 350, 500];

  let icon = 'ping5';

  steps.some((step, index) => {
    if (ping < step) {
      icon = 'ping' + index;
      return true;
    }
  });

  icon = require('@assets/ping/' + icon + '.png');

  return <StaticImage width="16px" height="12px" src={icon} />;
};

export default PingIcon;
