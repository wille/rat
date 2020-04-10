import { MessageType } from 'app/messages/types';
import { Monitor } from 'app/types/system';
import * as React from 'react';
import {
  DropdownButton,
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
} from 'react-bootstrap';
import Client from '../../client';
import { ScreenChunkTemplate, StreamMessage } from '../../messages/screen';
import withClient from '../../withClient';
import { Subscriber } from '../Subscription';

interface Props {
  client: Client;
}

interface State {
  scale: number;
  running: boolean;
  selectedMonitor: Monitor;
}

class Screen extends React.Component<Props, State> {
  canvas = React.createRef<HTMLCanvasElement>();
  canvas2 = React.createRef<HTMLCanvasElement>();

  constructor(props) {
    super(props);

    this.state = {
      scale: 1,
      running: true,
      selectedMonitor: props.client.monitors[0],
    };
  }

  componentDidMount() {
    this.stream();
  }

  componentWillUnmount() {
    this.stop();
  }

  onReceive = (message: ScreenChunkTemplate) => {
    if (!this.state.running) {
      return;
    }

    const ctx = this.canvas.current.getContext('2d');
    const ctx2 = this.canvas2.current.getContext('2d');

    const w = message.width - message.x;
    const h = message.height - message.y;

    // const imageData = ctx.getImageData(message.x, message.y, w, h);
    // const prevData = new Uint32Array(imageData.data.buffer);
    // const xorData = new Uint32Array(message.buffer.buffer.buffer);

    // for (let i = 0; i < xorData.length; i++) {
    //   prevData[i] ^= xorData[i];
    // }

    const imageData = new ImageData(
      new Uint8ClampedArray(message.buffer.buffer),
      w,
      h
    );
    ctx.putImageData(imageData, message.x, message.y);
    ctx2.clearRect(
      0,
      0,
      this.canvas2.current.width,
      this.canvas2.current.height
    );
    ctx2.strokeStyle = '#f00';
    ctx2.lineWidth = 4;
    ctx2.strokeRect(message.x, message.y, w, h);
  };

  render() {
    const { scale, running, selectedMonitor } = this.state;

    return (
      <Subscriber type={MessageType.Screen} handler={this.onReceive}>
        <Navbar>
          <Nav>
            <NavItem>Close</NavItem>
            <NavDropdown
              title={
                selectedMonitor
                  ? 'Monitor ' + selectedMonitor.id
                  : 'none selected'
              }
              id={'dropdown-size-medium'}
            >
              {this.props.client.monitors.map(monitor => (
                <DropdownButton
                  id={`monitor-${monitor.id}`}
                  key={monitor.id}
                  onClick={() => this.selectMonitor(monitor)}
                  title="Test"
                >
                  {monitor.id + ': ' + monitor.width + 'x' + monitor.height}
                </DropdownButton>
              ))}
            </NavDropdown>
            <NavItem>
              <input
                type="range"
                min={1}
                value={scale * 100}
                max={100}
                onChange={e => this.setScale(e.target.valueAsNumber)}
              />
            </NavItem>
            <NavItem onClick={() => this.toggle()}>
              {running ? 'Pause' : 'Start'}
            </NavItem>
          </Nav>
        </Navbar>
        {/* <Stream
          mouse
          keyboard
          data={frame}
          scale={scale}
          client={this.props.client}
        /> */}
        <div style={{ position: 'relative' }}>
          <canvas
            style={{
              position: 'absolute',
              width: '100%',
              maxWidth: `${Math.round(selectedMonitor.width * scale)}px`,
            }}
            ref={this.canvas}
            width={Math.round(selectedMonitor.width * scale)}
            height={Math.round(selectedMonitor.height * scale)}
          />
          <canvas
            style={{
              position: 'absolute',
              width: '100%',
              maxWidth: `${Math.round(selectedMonitor.width * scale)}px`,
            }}
            ref={this.canvas2}
            width={Math.round(selectedMonitor.width * scale)}
            height={Math.round(selectedMonitor.height * scale)}
          />
        </div>
      </Subscriber>
    );
  }

  private setScale(scale: number) {
    this.stop();
    this.setState(
      {
        scale: scale / 100,
      },
      this.stream
    );
  }

  private selectMonitor(monitor: Monitor) {
    this.setState(
      {
        selectedMonitor: monitor,
      },
      this.stream
    );
  }

  private toggle() {
    const { running } = this.state;

    if (running) {
      this.stop();
    } else {
      this.stream();
    }
  }

  private stream() {
    const { scale, selectedMonitor } = this.state;

    // reset canvas before initializing a new stream
    const canvas = this.canvas.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.props.client.send(
      new StreamMessage({
        active: true,
        scale,
        monitor: true,
        id: selectedMonitor.id,
      })
    );

    this.setState({
      running: true,
    });
  }

  private stop() {
    this.props.client.send(
      new StreamMessage({
        active: false,
      })
    );

    this.setState({
      running: false,
    });
  }
}

export default withClient(Screen);
