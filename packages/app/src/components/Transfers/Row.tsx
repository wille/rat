import * as React from 'react';
import styled from 'react-emotion';

import * as bytes from 'bytes';

import { compose, withProps } from 'recompose';
import {
  Recipient,
  TransferAction,
  TransferData,
  TransferState,
} from 'shared/templates';
import Client from '../../client';
import { TransferActionMessage } from '../../messages';
import withClient from '../../withClient';
import Progressbar from '../Progressbar';
import { getProgressColor } from './colors';

const DownloadIcon = require('assets/download.svg');
const UploadIcon = require('assets/upload.svg');

interface Props {
  transfer: TransferData;
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
  update = (action: TransferAction) =>
    this.props.client.send(
      new TransferActionMessage({ action, id: this.props.transfer.id })
    );

  download = () => {
    const { transfer } = this.props;
    window.open('/download/' + transfer.id.toHexString());
  };

  render() {
    const { transfer } = this.props;

    const typeIcon =
      transfer.recipient === Recipient.Client ? UploadIcon : DownloadIcon;

    const statusText =
      transfer.recipient === Recipient.Client
        ? `Uploading ${transfer.local} to ${transfer.remote}`
        : `Downloading ${transfer.remote}`;

    const percentage = Math.floor((transfer.recv / transfer.total) * 100);
    const bps = `${
      transfer.state !== TransferState.InProgress ? 'avg ' : ''
    }${bytes(transfer.bps)} /s`;

    return (
      <Container>
        <ContentContainer>
          <Icon src={typeIcon} />
          <Content>
            <p>{statusText}</p>
            <p>{`${bytes(transfer.recv)} / ${bytes(
              transfer.total
            )} (${percentage}%)`}</p>
            <p>{bps}</p>
          </Content>
          <Actions>
            {transfer.state === TransferState.InProgress && (
              <Action onClick={() => this.update(TransferAction.CANCEL)}>
                Cancel
              </Action>
            )}
            {transfer.state === TransferState.InProgress && (
              <Action onClick={() => this.update(TransferAction.PAUSE)}>
                Pause
              </Action>
            )}
            {transfer.state === TransferState.Paused && (
              <Action onClick={() => this.update(TransferAction.RESUME)}>
                Resume
              </Action>
            )}
            {transfer.state === TransferState.Complete && (
              <Action onClick={() => this.download()}>Download</Action>
            )}
          </Actions>
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
  }
}

export default withClient(Row);
