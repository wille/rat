import Client from '@app/client';
import { selectProcessList } from '@app/reducers';
import withClient from '@app/withClient';
import { Process, ProcessType } from '@templates';
import * as React from 'react';
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import ProcessMessage from '../../../shared/src/messages/process';
import { ProcessSubscription } from './Subscription';

interface Props {
  client: Client;
  processes: Process[];
}

class ProcessView extends React.Component<Props> {
  componentDidMount() {
    this.reload();
  }

  render() {
    const { processes } = this.props;

    return (
      <ProcessSubscription>
        <Table bordered>
          <thead>
            <tr>
              <th>PID</th>
              <th>Path</th>
            </tr>
          </thead>
          <tbody>
            {processes.map(process => (
              <tr key={process.pid}>
                <td>{process.pid}</td>
                <td>{process.path}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ProcessSubscription>
    );
  }

  reload() {
    this.props.client.send(
      new ProcessMessage({
        _id: this.props.client.id,
        action: ProcessType.Query,
      })
    );
  }
}

export default compose(
  connect(state => ({
    processes: selectProcessList(state),
  })),
  withClient
)(ProcessView);
