import * as React from 'react';
import styled from 'react-emotion';

const Progress = styled<any, 'div'>('div')`
  position: absolute;
  height: 100%;
  background: ${props => props.color};

  width: ${props => props.progress}%;
`;

const Container = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
`;

interface Props {
  value: number;
  max: number;
}

const Progressbar = ({ value, max }: Props) => (
  <Container>
    <Progress progress={(value / max) * 100} color="green" />
  </Container>
);

export default Progressbar;
