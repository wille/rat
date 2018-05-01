import Client from '@app/client';
import { selectClient } from '@app/reducers';
import ClientUpdate from '@components/ClientUpdate';
import * as React from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { css } from 'react-emotion';
import styled from 'react-emotion';
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
}

const styles = {
  row: css`
    &:hover {
      background-color: #f7f7f7;
    }
  `,
};

const Cell = styled('td')`
  * {
    display: inline-block;
    vertical-align: middle;
  }

  & > div {
    margin-right: 6px;
  }
`;

class ClientRow extends React.Component<Props> {
  public render() {
    const { client } = this.props;

    return (
      <ClientUpdate client={client} onUpdate={() => this.forceUpdate()}>
        <ContextMenuTrigger
          id={client.id}
          renderTag="tr"
          attributes={{ className: styles.row }}
        >
          <Cell>
            <FlagIcon client={client} />
            {client.country || 'Unknown'}
          </Cell>
          <Cell>{client.host}</Cell>
          <Cell>{client.identifier}</Cell>
          <Cell>
            <OsIcon os={client.os} />
            {client.os.display}
          </Cell>
          <Cell>
            <PingIcon ping={client.ping} />
            {client.ping + ' ms'}
          </Cell>

          <ContextMenu id={client.id}>
            <MenuItem onClick={() => this.redirect('screen')}>
              View Screen
            </MenuItem>
            <MenuItem onClick={() => this.redirect('fs')}>File System</MenuItem>
            <MenuItem onClick={() => this.redirect('process')}>
              Processes
            </MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
      </ClientUpdate>
    );
  }

  redirect = (path: string) => {
    this.props.history.push(`/view/${this.props.client.id}/${path}`);
  };
}

export default withRouter(ClientRow);
