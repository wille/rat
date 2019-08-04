import * as React from 'react';
import styled from 'react-emotion';

import * as bytes from 'bytes';

import Client from '../../client';
import { Transfer, TransferState } from '../../messages/transfers';
import withClient from '../../withClient';
import Progressbar from '../Progressbar';

const DownloadIcon = require('assets/download.svg');
const UploadIcon = require('assets/upload.svg');

interface Props {
  transfer: Transfer;
  client?: Client;
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

const Actions = styled('div')`
  justify-self: flex-end;
`;

const Action = styled('p')`
  text-decoration: underline;
  cursor: pointer;
`;

class Row extends React.Component<Props> {
  update = (/* action: TransferAction */) => {
    /* this.props.client.send(
      new TransferActionMessage({ action, id: this.props.transfer.id })
    ); */
  };

  download = () => {
    const { transfer } = this.props;

    let url = '';
    if (process.env.NODE_ENV === 'development') {
      url = 'https://localhost:7777';
    }

    url += '/download/' + transfer.id;
    window.open(url);
  };

  render() {
    const { transfer } = this.props;

    const typeIcon = transfer.download ? DownloadIcon : UploadIcon;

    const statusText = transfer.download
      ? `Downloading ${transfer.remote}`
      : `Uploading ${transfer.local} to ${transfer.remote}`;

    const percentage = Math.floor((transfer.offset / transfer.len) * 100);
    const bps = `${
      transfer.state !== TransferState.InProgress ? 'avg ' : ''
    }${bytes(transfer.bps)} /s`;

    return (
      <Container>
        <ContentContainer>
          <Icon src={typeIcon} />
          <Content>
            <p>{statusText}</p>
            <p>{`${bytes(transfer.offset)} / ${bytes(
              transfer.len
            )} (${percentage}%)`}</p>
            <p>{bps}</p>
          </Content>
          <Actions>
            {transfer.state === TransferState.InProgress && (
              <Action onClick={() => this.update(/* TransferAction.CANCEL */)}>
                Cancel
              </Action>
            )}
            {transfer.state === TransferState.InProgress && (
              <Action onClick={() => this.update(/* TransferAction.PAUSE */)}>
                Pause
              </Action>
            )}
            {transfer.state === TransferState.Paused && (
              <Action onClick={() => this.update(/* TransferAction.RESUME */)}>
                Resume
              </Action>
            )}
            {transfer.download &&
              transfer.state === TransferState.Complete && (
                <Action onClick={() => this.download()}>Download</Action>
              )}
          </Actions>
        </ContentContainer>
        <ProgressContainer>
          <Progressbar value={percentage} max={100} color="green" />
        </ProgressContainer>
      </Container>
    );
  }
}

export default withClient(Row);
