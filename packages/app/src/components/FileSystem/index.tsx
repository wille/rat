import { ObjectId } from 'bson';
import * as path from 'path';
import * as React from 'react';
import { Breadcrumb, Table } from 'react-bootstrap';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import { BrowserHistory, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { OperatingSystem } from 'shared/system';
import { Recipient, TransferState } from 'shared/templates';

import { uploadFiles } from 'app/src/lib/file-reader';
import { MessageType } from 'shared/types';
import { createPlaceholderTransfer } from '../../actions';
import Client from '../../client';
import {
  BrowseMessage,
  DirectoryContentTemplate,
  FileEntry,
  RequestTransfersMessage,
} from '../../messages/directory';
import { UploadToClientMessage } from '../../messages/outgoing-messages';
import withClient from '../../withClient';
import { Subscriber } from '../Subscription';
import Toolbar from '../Toolbar';
import Row from './Row';

interface Props {
  client: Client;
  history: BrowserHistory;
  createPlaceholderTransfer: typeof createPlaceholderTransfer;
}

interface State {
  files: FileEntry[];
  current?: string;
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
      files: [],
    };
  }

  componentDidMount() {
    this.browse();
  }

  splitPath = () => {
    const { client } = this.props;
    const { current } = this.state;

    return current
      ? current.split(client.separator).filter(x => x.length > 0)
      : [];
  };

  onReceive = (data: DirectoryContentTemplate) => {
    console.log('recv', data);
    this.setState({
      files: data,
    });
  };

  render() {
    const { client } = this.props;
    const { files } = this.state;

    const paths = this.splitPath();

    return (
      <Subscriber type={MessageType.Directory} handler={this.onReceive}>
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
            {files.map(file => (
              <Row
                key={file.path}
                file={file}
                onClick={() => this.browse(file)}
              />
            ))}
          </tbody>
        </Table>
      </Subscriber>
    );
  }

  upload = () => {
    const { history, client } = this.props;
    const { current } = this.state;

    uploadFiles(client, current);
    history.push('/transfers');
  };

  download = (file: FileEntry) => {
    const { client, history } = this.props;

    client.send(
      new RequestTransfersMessage({
        paths: [file],
      })
    );

    history.push('/transfers');
  };

  browse = (file?: FileEntry | string) => {
    const { client } = this.props;

    let path = '';

    if (typeof file === 'string') {
      path = file;
    } else if (file && file.dir) {
      path = file.path;
    } else if (file) {
      this.download(file as FileEntry);
      return;
    }

    if (client.os.type !== OperatingSystem.WINDOWS && path[0] !== '/') {
      path = '/' + path;
    }

    this.setState({
      current: path,
    });

    this.props.client.send(new BrowseMessage(path));
  };
}

export default compose(
  withRouter,
  withClient
)(FileSystem);
