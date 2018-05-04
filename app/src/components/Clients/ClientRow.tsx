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
  tabIndex?: number;
}

const Container = styled('div')`
  &:hover {
    background-color: #f7f7f7;
  }

  &:focus {
    background-color: #3f99df;
  }

  padding: 24px 12px;

  * {
    display: inline-block;
  }
`;

const TextContainer = styled('div')`
  padding: 12px;
`;

const Title = styled('span')`
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #000;
`;

const Host = styled('span')`
  font-size: 16px;
  color: gray;
`;

const Country = styled('span')`
  font-size: 16px;
  color: #3f99df;
`;

const NetworkContainer = styled('div')`
  margin-left: 12px;
  vertical-align: middle;
`;

const Info = styled('div')``;

class ClientRow extends React.Component<Props> {
  public render() {
    const { client, tabIndex } = this.props;

    return (
      <Container tabIndex={tabIndex}>
        <ClientUpdate client={client} onUpdate={() => this.forceUpdate()}>
          <OsIcon os={client.os} title={client.os.display} />
          <TextContainer>
            <Title>{client.identifier}</Title>
            <Info>
              <Country>{client.country || 'Unknown'}</Country>
              {'  '}
              <Host>{client.host}</Host>
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
