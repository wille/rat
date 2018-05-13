import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { RouteComponentProps, withRouter } from 'react-router';
import Client from './client';
import { selectClients } from './reducers';

interface Params {
  id: string;
}

interface Props extends RouteComponentProps<Params> {
  client: Client;
  list: Client[];
}

function withClient<
  T extends React.ComponentClass | React.StatelessComponent<any> = any
>(Component: T) {
  return compose(
    withRouter,
    connect(state => ({ list: selectClients(state) })),
    Component =>
      class extends React.Component<Props> {
        render() {
          const {
            list,
            match: {
              params: { id },
            },
          } = this.props;

          const client = list.find(client => client.id === id);

          return <Component client={client} {...this.props} />;
        }
      }
  )(Component) as T;
}

export default withClient;
