import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('div')`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Content = styled('div')`
  margin: 0 auto;
`;

const NotFound = () => (
  <Container>
    <Content>Nothing found here</Content>
  </Container>
);

export default NotFound;
