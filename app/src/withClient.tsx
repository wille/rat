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
