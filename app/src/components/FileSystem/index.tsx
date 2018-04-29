import Client from '@app/client';
import { selectClient, selectFilesList } from '@app/reducers';
import { DirectorySubscription } from '../Subscription';
import BrowseMessage from '@shared/messages/browse';
import { MessageType } from '@shared/types';
import { FileEntry } from '@templates';
import * as React from 'react';
import { Breadcrumb, Nav, Navbar, NavItem, Table } from 'react-bootstrap';
import { connect } from 'react-redux';

interface Props {
  client: Client;
  filesList: FileEntry[];
}

interface State {
  depth: string[];
}

const BreadcrumbItem = Breadcrumb.Item as any;

class FileSystem extends React.Component<Props, State> {
  state: State = {
    depth: [],
  };

  private currentDirectory: string;

  public componentDidMount() {
    this.browse('');
  }

  public render() {
    const { filesList } = this.props;
    const { depth } = this.state;

    let current = this.props.client.os.type === 'Windows' ? '' : '/';

    const tree = depth.filter(part => part.length > 0);

    return (
      <DirectorySubscription>
        <div style={{ padding: 10 }}>
          <Navbar>
            <Nav>
              <NavItem>Close</NavItem>
            </Nav>
          </Navbar>

          <Breadcrumb>
            {tree.map((part, index) => {
              const elem = index !== depth.length - 2 ? <a>{part}</a> : part;
              current += part + this.props.client.separator;
              const path = current;

              return (
                <BreadcrumbItem
                  key={part}
                  active={index === tree.length - 1}
                  onClick={() => this.browse(path, true)}
                >
                  {elem}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>

          <Table bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Last modified</th>
              </tr>
            </thead>
            <tbody>
              {filesList.map(file => {
                const size = file.directory ? '' : file.size;
                const icon = require('@assets/files/' +
                  this.getFileIcon(file.path, file.directory) +
                  '.png');

                return (
                  <tr key={file.path} onClick={() => this.browse(file.path)}>
                    <td>
                      <img src={icon} />
                      {file.path}
                    </td>
                    <td>{size}</td>
                    <td>{file.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </DirectorySubscription>
    );
  }

  private navigate(item: any) {
    console.log(item.target);
  }

  private browse(path: string, absolute: boolean = false) {
    const separator = this.props.client.separator;

    if (!this.currentDirectory) {
      this.currentDirectory = separator === '/' ? '/' : '';
    }

    if (path !== '') {
      if (absolute) {
        this.currentDirectory = path;
      } else {
        path = this.currentDirectory + path + separator;
        this.currentDirectory = path;
      }
    }

    const paths = path.split(separator);
    let depth = '';

    if (separator === '/') {
      paths.splice(0, 1);
      depth = '/';
    }

    this.setState({
      depth: paths,
    });

    console.log('browsing', path, this.currentDirectory);

    this.props.client.send(
      new BrowseMessage({
        id: this.props.client.id,
        path: this.currentDirectory,
      })
    );
  }

  private getFileIcon(name: string, isDir?: boolean) {
    if (isDir) {
      return 'folder';
    }

    if (name.indexOf('.') !== -1) {
      const ext = name
        .substring(name.lastIndexOf('.'), name.length)
        .toLowerCase();
      let type: string;

      switch (ext) {
        case '.zip':
        case '.tar':
        case '.gz':
          type = 'archive';
          break;
        case '.js':
        case '.sh':
        case '.bash':
          type = 'script';
          break;
        case '.bat':
        case '.cmd':
        case '.exe':
        case '.jar':
          type = 'application';
          break;
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.gif':
          type = 'image';
          break;
        default:
          type = 'file';
          break;
      }

      return type;
    }

    return 'file';
  }
}

export default connect(state => ({
  client: selectClient(state),
  filesList: selectFilesList(state)
}))(FileSystem);
