import Client from '@app/client';
import { selectClient, selectFilesList } from '@app/reducers';
import withClient from '@app/withClient';
import BrowseMessage from '@shared/messages/browse';
import { MessageType } from '@shared/types';
import { FileEntry } from '@templates';
import * as React from 'react';
import { Breadcrumb, Nav, Navbar, NavItem, Table } from 'react-bootstrap';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { DirectorySubscription } from '../Subscription';
import Row from './Row';

interface Props {
  client: Client;
  filesList: FileEntry[];
}

interface State {
  depth: string[];
  currentDirectory: FileEntry;
}

const BreadcrumbItem = Breadcrumb.Item as any;

const BreadcrumbContainer = styled('div')`
  padding: 12px;
`;

class FileSystem extends React.Component<Props, State> {
  state: State = {
    depth: [],
    currentDirectory: null,
  };

  public componentDidMount() {
    this.browse();
  }

  public render() {
    const { filesList } = this.props;
    const { depth } = this.state;

    let current = this.props.client.os.type === 'Windows' ? '' : '/';

    const tree = depth.filter(part => part.length > 0);

    return (
      <DirectorySubscription>
        <BreadcrumbContainer>
          <Breadcrumb>
            {tree.map((part, index) => {
              const elem = index !== depth.length - 2 ? <a>{part}</a> : part;
              current += part + this.props.client.separator;
              const path = current;

              return (
                <BreadcrumbItem
                  key={part}
                  active={index === tree.length - 1}
                  // onClick={() => this.browse(path, true)}
                >
                  {elem}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>
        </BreadcrumbContainer>

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

  private navigate(item: any) {
    console.log(item.target);
  }

  private browse(file?: FileEntry) {
    const { client } = this.props;

    if (!file || file.directory) {
      const path = file ? file.path + client.separator + file.name : '';

      this.setState({
        currentDirectory: file,
      });

      this.props.client.send(
        new BrowseMessage({
          id: this.props.client.id,
          path,
        })
      );
    }
  }
}

export default compose(
  connect(state => ({
    filesList: selectFilesList(state),
  })),
  withClient
)(FileSystem);
