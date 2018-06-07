import * as React from 'react';
import styled from 'react-emotion';
import { Recipient, TransferData } from 'shared/templates';

const DownloadIcon = require('assets/download.svg');
const UploadIcon = require('assets/upload.svg');

interface Props {
  transfer: TransferData;
}

const Container = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: stretch;

  padding: 12px;

  width: 100%;

  &:hover {
    background: ${props => props.theme.hover};
  }
`;

const Icon = styled<any, any>('div')`
  width: 32px;
  height: 32px;
  background-image: url(${props => props.src});
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;

  margin-right: 8px;
`;

const Row = ({ transfer }: Props) => {
  const typeIcon =
    transfer.recipient === Recipient.Client ? UploadIcon : DownloadIcon;

  let statusText;

  if (transfer.recipient === Recipient.Client) {
    statusText = `Uploading ${transfer.local} to ${transfer.remote}`;
  } else {
    statusText = `Downloading ${transfer.remote}`;
  }

  return (
    <Container>
      <Icon src={typeIcon} />
      <p>{statusText}</p>
    </Container>
  );
};

export default Row;
