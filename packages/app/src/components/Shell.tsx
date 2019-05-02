import { Subscriber } from 'app/src/components/Subscription';
import { ShellCommand, ShellMessage } from 'app/src/messages/shell';
import * as React from 'react';
import { MessageType } from 'shared/types';
import { Terminal } from 'xterm';
import 'xterm/dist/xterm.css';
import Client from '../client';
import withClient from '../withClient';

interface Props {
  client: Client;
}

class Shell extends React.Component<Props, any> {
  t: Terminal;
  ref = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.props.client.send(
      new ShellMessage({
        action: ShellCommand.Start,
      })
    );

    const t = new Terminal();
    t.open(this.ref.current);
    t.on('data', this.onTerminalInput);

    this.t = t;
  }

  componentWillUnmount() {
    this.props.client.send(
      new ShellMessage({
        action: ShellCommand.Stop,
      })
    );
  }

  onTerminalInput = data => {
    this.t.write(data);

    this.props.client.send(
      new ShellMessage({
        action: ShellCommand.Write,

        // seems like xterm gives us a carriage return instead of newline
        data: data.replace(/\r/g, '\n'),
      })
    );
  };

  onReceive = data => {
    console.log(data);
    // xterm wants both cr and lf
    this.t.write(data.line.replace(/\n/g, '\n\r'));
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
