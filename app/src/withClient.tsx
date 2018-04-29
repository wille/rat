import Client from '@app/client';
import { selectClients } from '@app/reducers';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';

interface Params {
  id: string;
}

interface Props extends RouteComponentProps<Params> {
  client: Client;
  list: Client[];
}

export default function withClient(Component): any {
  return withRouter(
    connect(state => ({ list: selectClients(state) }))(
      class extends React.Component<Props> {
        render() {
          const client = this.props.list.find(
            client => client.id === this.props.match.params.id
          );

          return <Component client={client} {...this.props} />;
        }
      }
    )
  );
}
