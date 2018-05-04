import Client from '@app/client';
import { selectClients } from '@app/reducers';
import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import ClientRow from './ClientRow';

const ListContainer = styled('div')`
  width: auto;
  overflow-y: scroll;
  height: 100%;
`;

interface Props {
  clients: Client[];
}

// const columns = ['Country', 'Host', 'Identifier', 'Operating System', 'Ping'];

class Clients extends React.Component<Props> {
  render() {
    const { clients } = this.props;

    return (
      <ListContainer>
        {clients.map(client => <ClientRow key={client.id} client={client} />)}
      </ListContainer>
    );
  }
}

export default connect(state => ({
  clients: selectClients(state),
}))(Clients);
