import * as React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import Connections from './components/Clients';

export default class App extends React.Component<any, any> {

  public state: any = {
    views: [],
    selected: null
  };

  public render() {
    const { views, selected } = this.state;

    return <Connections client={null} />;
  }

}
