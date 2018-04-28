import * as React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import Routes from './Routes';

export default class App extends React.Component<any, any> {
  public render() {
    return <Routes />;
  }
}
