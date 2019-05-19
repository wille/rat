import * as React from 'react';
import styled from 'react-emotion';
import AlignChildren from './AlignChildren';

const Container = styled('div')`
  height: 48px;
  background-color: #f7f7f7;
`;

const Toolbar = ({ children }) => (
  <Container>
    <AlignChildren>{children}</AlignChildren>
  </Container>
);

export default Toolbar;
