import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('div')`
  height: 72px;
  width: 275px;
`;

const Text = styled('div')`
  color: gray;
  text-transform: uppercase;
  text-align: center;
`;

const NoClientsRow = () => (
  <Container>
    <Text>No connected clients</Text>
  </Container>
);

export default NoClientsRow;
