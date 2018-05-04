import Spinner from '@components/Spinner';
import * as React from 'react';

interface Props {
  ping: number;
  [x: string]: any;
}

const PingIcon = ({ ping, ...props }: Props) => {
  const steps = [100, 150, 250, 350, 500];

  let icon = 'ping5';

  steps.some((step, index) => {
    if (ping < step) {
      icon = 'ping' + index;
      return true;
    }
  });

  icon = require('@assets/ping/' + icon + '.png');

  return (
    <Spinner
      width="16px"
      height="12px"
      src={typeof ping === 'number' && icon}
      {...props}
    />
  );
};

export default PingIcon;
