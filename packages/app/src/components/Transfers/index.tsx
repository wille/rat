import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import { Transfer } from 'src/messages/transfers';
import { selectTransferList } from '../../reducers/transfers';
import TransferRow from './Row';

const ListContainer = styled('div')`
  width: 100%;
  height: 100%;
`;

const Transfers = ({ transfers }: { transfers: Transfer[] }) => (
  <ListContainer>
    {transfers.map(transfer => (
      <TransferRow key={transfer.id} transfer={transfer} />
    ))}
  </ListContainer>
);

export default connect(state => ({
  transfers: selectTransferList(state),
}))(Transfers);
