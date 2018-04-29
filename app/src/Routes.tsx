import * as React from 'react';
import { Route, Switch } from 'react-router';

import Clients from './components/Clients';
import Card from './components/Clients/Card';
import FileSystem from './components/FileSystem';
import Process from './components/Process';
import Screen from './components/Screen';

const ViewRoutes = () => (
  <div>
    <Card />
    <Switch>
      <Route path="/view/screen" component={Screen} />
      <Route path="/view/process" component={Process} />
      <Route path="/view/fs" component={FileSystem} />
    </Switch>
  </div>
);

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Clients} />
    <Route path="/view/" component={ViewRoutes} />
  </Switch>
);

export default Routes;
