import Client from '@app/client';
import { selectClients } from '@app/reducers';
import * as React from 'react';
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';

import ClientRow from './ClientRow';

interface Props {
  clients: Client[];
}

const columns = ['Country', 'Host', 'Identifier', 'Operating System', 'Ping'];

class Clients extends React.Component<Props> {
  render() {
    return (
      <Table bordered>
        <thead>
          <tr>{columns.map(column => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {this.props.clients.map(client => {
            return <ClientRow key={client.id} client={client} />;
          })}
        </tbody>
      </Table>
    );
  }
}

export default connect(state => ({
  clients: selectClients(state),
}))(Clients);
