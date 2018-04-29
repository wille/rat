import { setActiveClient } from '@app/actions';
import Client from '@app/client';
import { selectClient } from '@app/reducers';
import ClientUpdate from '@components/ClientUpdate';
import * as React from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { connect } from 'react-redux';
import { History, RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import store from '../../';
import FlagIcon from './Flag';
import OsIcon from './OsIcon';
import PingIcon from './PingIcon';

interface Props extends RouteComponentProps<any> {
  client: Client;
  history: History;
  currentClient: Client;
  setActiveClient: typeof setActiveClient;
}

interface State {
  unsubscribe: () => void;
}

class ClientRow extends React.Component<Props, State> {
  public render() {
    const { client } = this.props;

    return (
      <ClientUpdate client={client} onUpdate={() => this.forceUpdate()}>
        <ContextMenuTrigger id={client.id} renderTag="tr">
          <td>
            <FlagIcon client={client} />
            {client.country || 'Unknown'}
          </td>
          <td>{client.host}</td>
          <td>{client.identifier}</td>
          <td>
            <OsIcon os={client.os} />
            {client.os.display}
          </td>
          <td>
            <PingIcon ping={client.ping} />
            {client.ping + ' ms'}
          </td>

          <ContextMenu id={client.id}>
            <MenuItem onClick={() => this.redirect('/view/screen', client)}>
              View Screen
            </MenuItem>
            <MenuItem onClick={() => this.redirect('/view/fs', client)}>
              File System
            </MenuItem>
            <MenuItem onClick={() => this.redirect('/view/process', client)}>
              Processes
            </MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
      </ClientUpdate>
    );
  }

  redirect(path: string, user: Client) {
    this.props.setActiveClient(user);
    this.props.history.push(path);
  }
}

export default compose<any, any>(
  connect(
    state => ({
      currentClient: selectClient(state),
    }),
    {
      setActiveClient,
    }
  ),
  withRouter
)(ClientRow);
