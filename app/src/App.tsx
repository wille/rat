import * as React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import * as SplitPane_ from 'react-split-pane';

import Connections from './components/Clients';

// quick fix for broken typings
const SplitPane = SplitPane_ as any;

export default class App extends React.Component<any, any> {

  public state: any = {
    views: [],
    selected: null
  };

  public render() {
    const { views, selected } = this.state;

    return (
      <div>
        <SplitPane defaultSize='50%' split='vertical'>
          <Connections client={null} />
          <div>

          </div>
        </SplitPane>
      </div>
    );
  }

}
