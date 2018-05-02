import withClient from '@app/withClient';
import { ClientSubscription } from '@components/Subscription';
import * as React from 'react';
import { Route, Switch } from 'react-router';

import ClientLoadingScreen from './components/ClientLoadingScreen';
import Clients from './components/Clients';
import Card from './components/Clients/Card';
import FileSystem from './components/FileSystem';
import Process from './components/Process';
import Screen from './components/Screen';

const Views = ({ client }) => (
  <div>
    {!client ? (
      <ClientLoadingScreen />
    ) : (
      <div>
        <a href="/">Back</a>
        <Card client={client} />
        <Switch>
          <Route path="/view/:id/screen" component={Screen} />
          <Route path="/view/:id/process" component={Process} />
          <Route path="/view/:id/fs" component={FileSystem} />
        </Switch>
      </div>
    )}
  </div>
);

const Views2 = withClient(Views);

const App = () => (
  <ClientSubscription>
    <Switch>
      <Route path="/(|view)" exact component={Clients} />
      <Route path="/view/:id" component={Views2} />
    </Switch>
  </ClientSubscription>
);

export default App;
