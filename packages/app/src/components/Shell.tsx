import * as React from 'react';
import { MessageType } from 'shared/types';
import { Terminal } from 'xterm';
import 'xterm/dist/xterm.css';
import { fit } from 'xterm/lib/addons/fit/fit';
import Client from '../client';
import {
  ShellAction,
  ShellMessage,
  ShellMessageTemplate,
} from '../messages/shell';
import withClient from '../withClient';
import { Subscriber } from './Subscription';

interface Props {
  client: Client;
}

class Shell extends React.Component<Props, any> {
  t: Terminal;
  ref = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const t = new Terminal();
    t.open(this.ref.current);
    fit(t);
    t.on('data', this.onTerminalInput);

    this.t = t;

    this.props.client.send(
      new ShellMessage({
        action: ShellAction.Start,
      })
    );
  }

  componentWillUnmount() {
    this.props.client.send(
      new ShellMessage({
        action: ShellAction.Stop,
      })
    );
  }

  onTerminalInput = (data: string) => {
    this.props.client.send(
      new ShellMessage({
        action: ShellAction.Write,

        // seems like xterm gives us a carriage return instead of newline
        data: data.replace(/\r/g, '\n'),
      })
    );
  };

  onReceive = (message: ShellMessageTemplate) => {
    switch (message.action) {
      case ShellAction.Write:
        // xterm wants both cr and lf
        this.t.write(message.data.replace(/\n/g, '\n\r'));
        break;
      default:
        throw new Error(`Shell action ${message.action} not implemented`);
    }
  };

  render() {
    return (
      <Subscriber type={MessageType.Shell} handler={this.onReceive}>
        <div ref={this.ref as any} />
      </Subscriber>
    );
  }
}

export default withClient(Shell);
