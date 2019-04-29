import { Subscriber } from 'app/src/components/Subscription';
import { ShellMessage } from 'app/src/messages';
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
  state = {
    data: '',
  };

  t: Terminal;
  ref = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.props.client.send(new ShellMessage({}));

    const t = new Terminal();
    t.open(this.ref.current);
    t.on('data', d => {
      t.write(d);

      this.props.client.send(
        new ShellMessage({
          action: 1,

          // seems like xterm gives us a carriage return instead of newline
          command: d.replace(/\r/g, '\n'),
        })
      );
    });

    this.t = t;
  }

  onReceive = data => {
    console.log('recv', data);

    // xterm wants both cr and lf
    this.t.write(data.line.replace(/\n/g, '\n\r'));
  };

  render() {
    const { data } = this.state;
    return (
      <Subscriber type={MessageType.Shell} handler={this.onReceive}>
        <div ref={this.ref as any} />
      </Subscriber>
    );
  }
}

export default withClient(Shell);
