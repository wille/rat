import * as React from 'react';
import styled, { css } from 'react-emotion';

import { Link } from 'react-router-dom';
import Client from '../../client';
import withClient from '../../withClient';
import AlignChildren from '../AlignChildren';
import FlagIcon from '../Clients/Flag';

interface Props {
  client: Client;
}

const Container = styled('div')`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;

  * {
    display: block;
  }
`;

const Content = styled('div')`
  margin: 0 auto;
`;

const link = css`
  color: #3f99df;
  cursor: pointer;
  padding: 4px;
  font-size: 18px;

  &:hover {
    text-decoration: none;
    color: #3f99df;
  }
`;

const Item = ({ to, children }) => (
  <Link to={to} className={link}>
    {children}
  </Link>
);

const Navigation = styled('ul')`
  padding: 0;
`;

const NestedList = styled('ul')`
  padding-top: 4px;
`;

const Info = styled('div')`
  margin: 0 auto;
`;

const ClientHome = ({ client }: Props) => {
  const link = page => `/client/${client.id}/${page}`;

  return (
    <Container>
      <Content>
        <Info>
          <AlignChildren>
            <FlagIcon client={client} />
            {client.country || 'Unknown'}
          </AlignChildren>
        </Info>
        <Navigation>
          <Item to={link('screen')}>
            View screen
            <NestedList>
              <Item to={link('')}>View windows</Item>
            </NestedList>
          </Item>
          <Item to={link('fs')}>Browse files</Item>
          <Item to={link('process')}>Manage processes</Item>
        </Navigation>
      </Content>
    </Container>
  );
};

export default withClient(ClientHome);
