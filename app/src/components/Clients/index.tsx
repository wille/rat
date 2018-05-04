import Client from '@app/client';
import { selectClients } from '@app/reducers';
import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import ClientRow from './ClientRow';

import { History, matchPath, withRouter } from 'react-router-dom';

const ListContainer = styled('div')`
  width: auto;
  overflow-y: scroll;
  height: 100%;
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
        {clients.map((client, i) => {
          const match = matchPath(location.pathname, {
            path: '/:id',
          });

          return (
            <ClientRow
              key={client.id}
              client={client}
              selected={client.id === match.params.id}
              onClick={() => history.push('/' + client.id)}
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
