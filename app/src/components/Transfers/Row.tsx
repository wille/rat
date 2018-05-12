import * as React from 'react';
import styled from 'react-emotion';
import { TransferData } from 'shared/templates';

interface Props {
  transfer: TransferData;
}

const Container = styled('div')`
  width: 100%;
  height: 48px;
`;

const Row = ({ transfer }: Props) => (
  <Container>{transfer.remote + transfer.local}</Container>
);

export default Row;
