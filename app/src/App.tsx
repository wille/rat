import * as React from 'react';
import { Route, Switch } from 'react-router';

import { selectClient, selectIsLoadingClients } from '@app/reducers';
import { connect } from 'react-redux';

import { ClientSubscription } from '@components/Subscription';
import Clients from './components/Clients';
import Card from './components/Clients/Card';
import FileSystem from './components/FileSystem';
import Process from './components/Process';
import Screen from './components/Screen';

const Views = ({ client, isLoading }) => (
  <div>
    {!isLoading ? (
      <div>
        <Card />
        <Switch>
          <Route path="/view/screen" component={Screen} />
          <Route path="/view/process" component={Process} />
          <Route path="/view/fs" component={FileSystem} />
        </Switch>
      </div>
    ) : (
      <p>Loading</p>
    )}
  </div>
);

const Views2 = connect(state => ({
  client: selectClient(state),
  isLoading: selectIsLoadingClients(state),
}))(Views);

const App = () => (
  <ClientSubscription>
    <Switch>
      <Route path="/" exact component={Clients} />
      <Route path="/view/" component={Views2} />
    </Switch>
  </ClientSubscription>
);

export default App;
