import ProcessListHandler from '@messages/process';
import { MessageType } from '@shared/types';
import { Process, ProcessType } from '@templates';
import * as React from 'react';
import { Table } from 'react-bootstrap';
import ClientComponent from './clientComponent';

import ProcessMessage from '../../../shared/src/messages/process';

interface State {
  processes: Process[];
}

export default class ProcessView extends ClientComponent<{}, State> {

  public state: State = {
    processes: []
  };

  public componentDidMount() {
    this.subscribe(MessageType.Process, new ProcessListHandler(this));
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
          {processes.map((process) => {
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
    this.client.send(new ProcessMessage({
      _id: this.client.id,
      action: ProcessType.Query
    }));
  }
}
