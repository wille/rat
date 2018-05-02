import styled from 'react-emotion';

interface Props {
  src: string;
  size?: string;
  width?: string;
  height?: string;
}

const StaticImage = styled<Props, 'div'>('div')`
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  width: ${props => props.width || props.size};
  height: ${props => props.height || props.size};
`;

export { Props as StaticImageProps };
export default StaticImage;
