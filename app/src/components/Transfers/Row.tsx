import * as React from 'react';
import styled from 'react-emotion';
import { Recipient, TransferData } from 'shared/templates';

interface Props {
  transfer: TransferData;
}

const Container = styled('div')`
  width: 100%;
  height: 48px;
`;

const Row = ({ transfer }: Props) => {
  let remote;
  let local;

  switch (transfer.recipient) {
    case Recipient.Client:
    case Recipient.Server:
  }

  return (
    <Container>
      <p>{remote}</p>
      <p>{local}</p>
      {JSON.stringify(transfer)}
    </Container>
  );
};

export default Row;
