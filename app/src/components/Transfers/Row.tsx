import * as React from 'react';
import styled from 'react-emotion';
import { Recipient, TransferData } from 'shared/templates';

import DownloadIcon from '../../assets/download.svg';
import UploadIcon from '../../assets/upload.svg';

interface Props {
  transfer: TransferData;
}

const Container = styled('div')`
  width: 100%;
  height: 48px;
`;

const Row = ({ transfer }: Props) => {
  const typeIcon =
    transfer.recipient === Recipient.Client ? UploadIcon : DownloadIcon;

  return (
    <Container>
      <img src={typeIcon} />
      <p>{transfer.remote}</p>
      <p>{transfer.local}</p>
      {JSON.stringify(transfer)}
    </Container>
  );
};

export default Row;
