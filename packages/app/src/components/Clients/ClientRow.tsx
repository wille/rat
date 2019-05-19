import { withTheme } from 'emotion-theming';
import * as React from 'react';
import styled from 'react-emotion';
import { RouteComponentProps } from 'react-router-dom';

import Client from '../../client';
import ClientUpdate from '../ClientUpdate';
import OsIcon from './OsIcon';
import PingIcon from './PingIcon';

interface Props extends RouteComponentProps<any> {
  client: Client;
  selected: boolean;
  theme?: any;
  onClick: () => void;
}

const Container = styled('div')`
  &:hover {
    background-color: ${props => props.color || props.theme.hover};
  }

  background-color: ${props => props.color || props.theme.background};

  padding: 12px;
  height: 72px;

  * {
    display: inline-block;
  }
`;

const TextContainer = styled('div')`
  padding: 0 12px;
`;

const Title = styled<any, any>('span')`
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: ${props =>
    props.selected ? props.theme.background : props.theme.primary};
`;

const Host = styled<any, any>('span')`
  font-size: 16px;
  color: ${props =>
    props.selected ? props.theme.background : props.theme.secondary};
`;

const Country = styled<any, any>('span')`
  font-size: 16px;
  color: ${props =>
    props.selected ? props.theme.background : props.theme.focus};
`;

const NetworkContainer = styled('div')`
  margin-left: 12px;
  vertical-align: middle;
`;

const Info = styled('div')``;

class ClientRow extends React.Component<Props> {
  public render() {
    const { client, selected, onClick, theme } = this.props;

    const color = selected ? theme.focus : undefined;

    return (
      <Container color={color} onClick={onClick}>
        <ClientUpdate client={client} onUpdate={() => this.forceUpdate()}>
          <OsIcon size="36px" os={client.os} title={client.os.display} />
          <TextContainer>
            <Title selected={selected}>{client.identifier}</Title>
            <Info>
              <Country selected={selected}>
                {client.country || 'Unknown'}
              </Country>
              <Host selected={selected}>{client.host}</Host>
            </Info>
          </TextContainer>
          <NetworkContainer>
            <PingIcon ping={client.ping} />
          </NetworkContainer>
        </ClientUpdate>
      </Container>
    );
  }
}

export default withTheme(ClientRow);
