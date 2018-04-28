import Client from '@app/client';
import * as EventHandler from '@app/messages';
import { ClientSubscription } from '@app/messages';
import { MessageType } from '@shared/types';
import * as React from 'react';
import { Table } from 'react-bootstrap';

import { selectClients } from '@app/reducers/clients';
import { connect } from 'react-redux';
import ClientRow from './ClientRow';

interface State {
  clients: Client[];
}

const columns = ['Country', 'Host', 'Identifier', 'Operating System', 'Ping'];

class Clients extends React.Component<any> {
  public state: State = {
    clients: [],
  };

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <ClientSubscription>
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
      </ClientSubscription>
    );
  }
}

export default connect(state => ({
  clients: selectClients(state),
}))(Clients);
