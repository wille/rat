import Client from '@app/client';
import { selectFps, selectScreenBuffer } from '@app/reducers';
import withClient from '@app/withClient';
import { ScreenFrameTemplate } from '@templates';
import * as React from 'react';
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import StreamMessage from 'shared/messages/stream';
import { Monitor } from 'shared/system';

import { ScreenSubscription } from '../Subscription';
import Stream from './Stream';

interface Props {
  client: Client;
  frame: ScreenFrameTemplate;
  fps: number;
}

interface State {
  scale: number;
  running: boolean;
  selectedMonitor: Monitor;
}

class Screen extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      scale: 0.1,
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

  render() {
    const { frame, fps } = this.props;
    const { scale, running, selectedMonitor } = this.state;

    return (
      <ScreenSubscription>
        <Navbar>
          <Nav>
            <NavItem>Close</NavItem>
            <NavDropdown
              title={'Monitor ' + selectedMonitor.id}
              id={'dropdown-size-medium'}
            >
              {this.props.client.monitors.map(monitor => (
                <MenuItem
                  key={monitor.id}
                  onClick={() => this.selectMonitor(monitor)}
                >
                  {monitor.id + ': ' + monitor.width + 'x' + monitor.height}
                </MenuItem>
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
            <NavItem>{fps} FPS</NavItem>
          </Nav>
        </Navbar>
        <Stream
          mouse
          keyboard
          data={frame}
          scale={scale}
          client={this.props.client}
        />
      </ScreenSubscription>
    );
  }

  private setScale(scale: number) {
    this.setState(
      {
        scale: scale / 100,
      },
      () => {
        this.stop();
        this.stream();
      }
    );
  }

  selectMonitor = (monitor: Monitor) =>
    this.setState(
      {
        selectedMonitor: monitor,
      },
      () => this.stream()
    );

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

    this.props.client.send(
      new StreamMessage({
        active: true,
        scale,
        monitor: true,
        handle: selectedMonitor.id,
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

export default compose(
  connect(state => ({
    frame: selectScreenBuffer(state),
    fps: selectFps(state),
  })),
  withClient
)(Screen);
