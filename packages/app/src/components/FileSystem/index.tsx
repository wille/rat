import { ObjectId } from 'bson';
import * as path from 'path';
import * as React from 'react';
import { Breadcrumb, Table } from 'react-bootstrap';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import { BrowserHistory, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { OperatingSystem } from 'shared/system';
import { FileEntry, Recipient, TransferState } from 'shared/templates';

import { requestFile } from 'app/src/lib/file-reader';
import { createPlaceholderTransfer, setCurrentDirectory } from '../../actions';
import Client from '../../client';
import {
  BrowseMessage,
  DownloadToServerMessage,
  UploadToClientMessage,
} from '../../messages/outgoing-messages';
import { selectCurrentDirectory, selectFilesList } from '../../reducers';
import withClient from '../../withClient';
import { DirectorySubscription } from '../Subscription';
import Toolbar from '../Toolbar';
import Row from './Row';

interface Props {
  client: Client;
  filesList: FileEntry[];
  currentDirectory: string;
  history: BrowserHistory;
  setCurrentDirectory: typeof setCurrentDirectory;
  createPlaceholderTransfer: typeof createPlaceholderTransfer;
}

interface State {
  utils: any;
}

const styles = {
  breadcrumb: css`
    font-size: 18px;
  `,
};

const BreadcrumbItem = Breadcrumb.Item as any;

class FileSystem extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      utils:
        props.client.os.type === OperatingSystem.WINDOWS
          ? path.win32
          : path.posix,
    };
  }

  componentDidMount() {
    this.browse();
  }

  splitPath = () => {
    const { client, currentDirectory } = this.props;

    return currentDirectory.split(client.separator).filter(x => x.length > 0);
  };

  render() {
    const { filesList, client } = this.props;

    const paths = this.splitPath();

    return (
      <DirectorySubscription>
        <Toolbar>
          <button onClick={this.upload}>Upload</button>
          <Breadcrumb className={styles.breadcrumb}>
            {client.os.type !== OperatingSystem.WINDOWS && (
              <BreadcrumbItem active={false} onClick={() => this.browse()}>
                root
              </BreadcrumbItem>
            )}

            {paths.map((part, index) => {
              return (
                <BreadcrumbItem
                  key={part}
                  active={index === paths.length - 1}
                  onClick={() =>
                    this.browse(
                      paths.slice(0, index + 1).join(client.separator)
                    )
                  }
                >
                  {part}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>
        </Toolbar>

        <Table bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Last modified</th>
            </tr>
          </thead>
          <tbody>
            {filesList.map(file => (
              <Row
                key={file.path + file.name}
                file={file}
                onClick={() => this.browse(file)}
              />
            ))}
          </tbody>
        </Table>
      </DirectorySubscription>
    );
  }

  upload = () => {
    const { createPlaceholderTransfer, history, currentDirectory } = this.props;

    const id = new ObjectId();

    createPlaceholderTransfer({
      id,
      local: '',
      remote: currentDirectory,
      total: 0,
      recv: 0,
      state: TransferState.Waiting,
      recipient: Recipient.Server,
    });

    requestFile(this.props.client, currentDirectory);

    history.push('/transfers');
  };

  download = (file: FileEntry) => {
    const { client, history, createPlaceholderTransfer } = this.props;

    const id = new ObjectId();

    createPlaceholderTransfer({
      id,
      local: '',
      remote: file.path + client.separator + file.name,
      total: 0,
      recv: 0,
      state: TransferState.Waiting,
      recipient: Recipient.Server,
    });

    client.send(
      new DownloadToServerMessage({
        id,
        file: file.path + client.separator + file.name,
      })
    );

    history.push('/transfers');
  };

  browse = (file?: FileEntry | string) => {
    const { client, setCurrentDirectory } = this.props;

    let path = '';

    if (typeof file === 'string') {
      path = file;
    } else if (file && file.directory) {
      path = file ? file.path + client.separator + file.name : '';
    } else if (file) {
      this.download(file as FileEntry);
      return;
    }

    if (client.os.type !== OperatingSystem.WINDOWS && path[0] !== '/') {
      path = '/' + path;
    }

    setCurrentDirectory(path);

    this.props.client.send(
      new BrowseMessage({
        id: this.props.client.id,
        path,
      })
    );
  };
}

export default compose(
  connect(
    state => ({
      filesList: selectFilesList(state),
      currentDirectory: selectCurrentDirectory(state),
    }),
    {
      setCurrentDirectory,
      createPlaceholderTransfer,
    }
  ),
  withRouter,
  withClient
)(FileSystem);
