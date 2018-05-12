import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import { selectTransferList } from '../../reducers/transfers';
import TransferRow from './Row';

const ListContainer = styled('div')`
  width: 100%;
  height: 100%;
`;

const Transfers = ({ transfers }) => (
  <ListContainer>
    {transfers.map(transfer => (
      <TransferRow key={transfer._id.toHexString()} transfer={transfer} />
    ))}
  </ListContainer>
);

export default connect(state => ({
  transfers: selectTransferList(state),
}))(Transfers);
