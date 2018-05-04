import Client from '@app/client';
import withClient from '@app/withClient';
import * as React from 'react';

interface Props {
  client: Client;
}

const ClientHome = ({ client }: Props) => <p>Client home</p>;

export default withClient(ClientHome);
