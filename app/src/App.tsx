import * as React from 'react';
import { Route, Switch } from 'react-router';

import Clients from './components/Clients';
import Card from './components/Clients/Card';
import FileSystem from './components/FileSystem';
import Process from './components/Process';
import Screen from './components/Screen';

const Views = () => (
  <div>
    <Card />
    <Switch>
      <Route path="/view/screen" component={Screen} />
      <Route path="/view/process" component={Process} />
      <Route path="/view/fs" component={FileSystem} />
    </Switch>
  </div>
);

const App = () => (
  <Switch>
    <Route path="/" exact component={Clients} />
    <Route path="/view/" component={Views} />
  </Switch>
);

export default App;
