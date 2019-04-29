import * as React from 'react';
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Monitor } from 'shared/system';
import { ScreenFrameTemplate } from 'shared/templates';

import { Subscriber } from 'app/src/components/Subscription';
import { ShellMessage } from 'app/src/messages';
import { MessageType } from 'shared/types';
import Client from '../client';
import withClient from '../withClient';

interface Props {
  client: Client;
}

class Shell extends React.Component<Props, any> {
  state = {
    data: '',
  };

  componentDidMount() {
    this.props.client.send(new ShellMessage({}));
  }

  on = data => {
    console.log('recv', data);

    this.setState(prevState => ({
      data: prevState.data + data,
    }));
  };

  render() {
    const { data } = this.state;
    return (
      <Subscriber type={MessageType.Shell} handler={this.on}>
        {data}
      </Subscriber>
    );
  }
}

export default withClient(Shell);
