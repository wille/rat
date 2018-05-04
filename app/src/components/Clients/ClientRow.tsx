import Client from '@app/client';
import ClientUpdate from '@components/ClientUpdate';
import * as React from 'react';
import styled from 'react-emotion';
import { History, RouteComponentProps, withRouter } from 'react-router-dom';

import OsIcon from './OsIcon';
import PingIcon from './PingIcon';

interface Props extends RouteComponentProps<any> {
  client: Client;
  history: History;
  selected: boolean;
  onClick: () => void;
}

const Container = styled('div')`
  &:hover {
    background-color: ${props => props.color || '#f7f7f7'};
  }

  background-color: ${props => props.color || '#fff'};

  padding: 12px;

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
  color: ${props => (props.selected ? '#fff' : '#000')};
`;

const Host = styled<any, any>('span')`
  font-size: 16px;
  color: ${props => (props.selected ? '#fff' : 'gray')};
`;

const Country = styled<any, any>('span')`
  font-size: 16px;
  color: ${props => (props.selected ? '#fff' : '#3f99df')};
`;

const NetworkContainer = styled('div')`
  margin-left: 12px;
  vertical-align: middle;
`;

const Info = styled('div')``;

class ClientRow extends React.Component<Props> {
  public render() {
    const { client, selected, onClick } = this.props;

    const color = selected ? '#3f99df' : undefined;

    return (
      <Container color={color} onClick={onClick}>
        <ClientUpdate client={client} onUpdate={() => this.forceUpdate()}>
          <OsIcon os={client.os} title={client.os.display} />
          <TextContainer>
            <Title selected={selected}>{client.identifier}</Title>
            <Info>
              <Country selected={selected}>
                {client.country || 'Unknown'}
              </Country>
              {'  '}
              <Host selected={selected}>{client.host}</Host>
            </Info>
            <NetworkContainer>
              <PingIcon ping={client.ping} />
            </NetworkContainer>
          </TextContainer>
        </ClientUpdate>
      </Container>
    );
  }

  redirect = (path: string) => {
    this.props.history.push(`/view/${this.props.client.id}/${path}`);
  };
}

export default withRouter(ClientRow);
