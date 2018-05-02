import * as React from 'react';

import StaticImage, { StaticImageProps } from '@components/Clients/StaticImage';

const Icon = require('@assets/loading.svg');

interface Props extends StaticImageProps {
  src: string;
}

const Loading = ({ src, ...props }: Props) => (
  <StaticImage src={src || Icon} {...props} />
);

export default Loading;
