import * as React from 'react';
import { Route, Switch } from 'react-router';

import Clients from './components/Clients';
import FileSystem from './components/FileSystem';
import Process from './components/Process';
import Screen from './components/Screen';

const ClientRoutes = () => (
  <Switch>
    <Route path="/u/screen/:id" component={Screen} />
    <Route path="/u/process/:id" component={Process} />
    <Route path="/u/fs/:id" component={FileSystem} />
  </Switch>
);

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Clients} />
    <Route path="/u/" component={ClientRoutes} />
  </Switch>
);
