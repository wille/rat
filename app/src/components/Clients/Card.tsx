import Client from '@app/client';
import { selectClient } from '@app/reducers';
import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import OsIcon from './OsIcon';

const Container = styled('div')`
  border-radius: 4px;
  border: 1px solid #777;
  padding: 12px;
`;

interface Props {
  client: Client;
}

const Card = ({ client }: Props) => (
  <Container>
    <div>
      <OsIcon os={client.os} />
      {client.identifier}
    </div>
  </Container>
);

export default connect(state => ({
  client: selectClient(state),
}))(Card);
