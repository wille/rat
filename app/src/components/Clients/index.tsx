import Client from '@app/client';
import { selectClients } from '@app/reducers';
import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import ClientRow from './ClientRow';

import NoClientsRow from '@components/Clients/NoClientsRow';
import { History, matchPath, withRouter } from 'react-router-dom';

const ListContainer = styled('div')`
  width: auto;
  overflow-y: scroll;
  height: 100vh;
`;

interface Props {
  clients: Client[];
  history: History;
}

class Clients extends React.Component<Props> {
  render() {
    const { clients, history } = this.props;
    return (
      <ListContainer>
        {clients.length === 0 && <NoClientsRow />}
        {clients.map((client, i) => {
          const match = matchPath(location.pathname, {
            path: '/client/:id',
          });

          const selected = client.id === (match && match.params.id);

          return (
            <ClientRow
              key={client.id}
              client={client}
              selected={selected}
              onClick={() => history.push('/client/' + client.id)}
            />
          );
        })}
      </ListContainer>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    clients: selectClients(state),
  }))
)(Clients);
