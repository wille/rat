import * as React from 'react';
import styled from 'react-emotion';

import * as bytes from 'bytes';

import { Recipient, TransferData } from 'shared/templates';
import Progressbar from '../Progressbar';
import { getProgressColor } from './colors';

const DownloadIcon = require('assets/download.svg');
const UploadIcon = require('assets/upload.svg');

interface Props {
  transfer: TransferData;
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
`;

const ProgressContainer = styled('div')`
  width: 100%;
  height: 6px;
`;

const ContentContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: stretch;

  padding: 12px;

  width: 100%;

  &:hover {
    background: ${props => props.theme.hover};
  }
`;

const Content = styled('div')`
  display: flex;
  flex-direction: column;
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

  const percentage = Math.floor((transfer.recv / transfer.total) * 100);

  return (
    <Container>
      <ContentContainer>
        <Icon src={typeIcon} />
        <Content>
          <p>{statusText}</p>
          <p>{`${bytes(transfer.recv)} / ${bytes(
            transfer.total
          )} (${percentage}%)`}</p>
        </Content>
      </ContentContainer>
      <ProgressContainer>
        <Progressbar
          value={50}
          max={100}
          color={getProgressColor(transfer.state)}
        />
      </ProgressContainer>
    </Container>
  );
};

export default Row;
