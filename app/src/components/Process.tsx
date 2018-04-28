import ProcessListHandler from '@messages/process';
import { MessageType } from '@shared/types';
import { Process, ProcessType } from '@templates';
import * as React from 'react';
import { Table } from 'react-bootstrap';

import Client from '@app/client';
import { selectClient } from '@app/reducers/clients';
import { connect } from 'react-redux';
import ProcessMessage from '../../../shared/src/messages/process';

interface Props {
  client: Client;
}

interface State {
  processes: Process[];
}

class ProcessView extends React.Component<Props> {
  public state: State = {
    processes: [],
  };

  public componentDidMount() {
    // this.subscribe(MessageType.Process, new ProcessListHandler(this));
    this.reload();
  }

  public render() {
    const { processes } = this.state;

    return (
      <Table bordered>
        <thead>
          <tr>
            <th>PID</th>
            <th>Path</th>
          </tr>
        </thead>
        <tbody>
          {processes.map(process => {
            return (
              <tr key={process.pid}>
                <td>{process.pid}</td>
                <td>{process.path}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  private reload() {
    this.props.client.send(
      new ProcessMessage({
        _id: this.props.client.id,
        action: ProcessType.Query,
      })
    );
  }
}

export default connect(state => ({
  client: selectClient(state),
}))(ProcessView);
