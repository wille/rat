import withClient from '@app/withClient';
import { ClientSubscription } from '@components/Subscription';
import * as React from 'react';
import { Route, Switch } from 'react-router';

import ClientHome from './components/ClientHome';
import ClientLoadingScreen from './components/ClientLoadingScreen';
import Clients from './components/Clients';
import Client404 from './components/Clients/404';
import FileSystem from './components/FileSystem';
import Process from './components/Process';
import Screen from './components/Screen';

import styled from 'react-emotion';

const Container = styled('div')`
  display: flex;
`;

const Content = styled('div')`
  flex: 1;
`;

const Views = ({ client }) => (
  <Content>
    {!client ? (
      <ClientLoadingScreen />
    ) : (
      <Switch>
        <Route path="/client/:id" exact component={ClientHome} />
        <Route path="/client/:id/screen" component={Screen} />
        <Route path="/client/:id/process" component={Process} />
        <Route path="/client/:id/fs" component={FileSystem} />
        <Route component={Client404} />
      </Switch>
    )}
  </Content>
);

const Views2 = withClient(Views);

const App = () => (
  <ClientSubscription>
    <Container>
      <Clients />
      <Switch>
        <Route path="/client/:id" component={Views2} />
      </Switch>
    </Container>
  </ClientSubscription>
);

export default App;
