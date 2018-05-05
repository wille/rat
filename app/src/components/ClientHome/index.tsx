import Client from '@app/client';
import withClient from '@app/withClient';
import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Link } from 'react-router-dom';

interface Props {
  client: Client;
}

const Content = styled('div')`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;

  * {
    display: block;
  }
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
  margin: 0 auto;
`;

const NestedList = styled('ul')`
  padding-top: 4px;
`;

const ClientHome = ({ client }: Props) => {
  const link = page => `/client/${client.id}/${page}`;

  return (
    <Content>
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
  );
};

export default withClient(ClientHome);
