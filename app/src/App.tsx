import * as React from 'react';
import { Route, Switch } from 'react-router';

import { selectClient } from '@app/reducers';
import { connect } from 'react-redux';

import Clients from './components/Clients';
import Card from './components/Clients/Card';
import FileSystem from './components/FileSystem';
import Process from './components/Process';
import Screen from './components/Screen';

const Views = ({ client }) => (
  <div>
    {client ? (
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
}))(Views);

const App = () => (
  <Switch>
    <Route path="/" exact component={Clients} />
    <Route path="/view/" component={Views2} />
  </Switch>
);

export default App;
