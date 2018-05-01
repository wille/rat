import {  } from '@app/actions';
import Client from '@app/client';
import { selectClient } from '@app/reducers';
import KeyMessage from '@messages/outgoing/key';
import { MouseMessage, MouseMotionMessage } from '@messages/outgoing/mouse';
import { InputState } from 'shared/display';
import { ScreenFrameTemplate } from '@templates';
import * as React from 'react';
import { connect } from 'react-redux';
import withClient from '@app/withClient';

interface Props {
  data: ScreenFrameTemplate;
  mouse: boolean;
  keyboard: boolean;
  scale: number;
  client: Client;
}

type MouseEvent = React.MouseEvent<HTMLDivElement>;

class Stream extends React.Component<Props> {
  public componentDidMount() {
    document.addEventListener('keydown', this.keyDownEvent);
    document.addEventListener('keydown', this.keyUpEvent);
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDownEvent);
    document.removeEventListener('keyup', this.keyUpEvent);
  }

  public render() {
    const { data } = this.props;
    const encoded = data
      ? 'data:image/jpeg;base64,' + data.data.toString('base64')
      : null;

    return (
      <div
        style={{
          backgroundImage: "url('" + encoded + "')",
          backgroundRepeat: 'no-repeat',
          width: data ? data.width : 0,
          height: data ? data.height : 0,
        }}
        onMouseDown={e => this.onMouseDown(e)}
        onMouseUp={e => this.onMouseUp(e)}
        onMouseMove={e => this.onMouseMove(e)}
      />
    );
  }

  private keyDownEvent = (e: any) =>
    this.keyEvent(e.which || e.keyCode, InputState.PRESS);
  private keyUpEvent = (e: any) =>
    this.keyEvent(e.which || e.keyCode, InputState.RELEASE);

  private get monitor() {
    return 0;
  }

  private get mouse() {
    return this.props.mouse;
  }

  private get keyboard() {
    return this.props.keyboard;
  }

  private onMouseDown(event: MouseEvent) {
    if (this.mouse) {
      this.props.client.send(
        new MouseMessage({
          monitor: this.monitor,
          button: event.button,
          state: InputState.PRESS,
        })
      );
    }
  }

  private onMouseUp(event: MouseEvent) {
    if (this.mouse) {
      this.props.client.send(
        new MouseMessage({
          monitor: this.monitor,
          button: event.button,
          state: InputState.RELEASE,
        })
      );
    }
  }

  private onMouseMove(event: MouseEvent) {
    const { scale } = this.props;

    if (this.mouse) {
      this.props.client.send(
        new MouseMotionMessage({
          monitor: this.monitor,
          x: event.nativeEvent.offsetX / (scale / 100),
          y: event.nativeEvent.offsetY / (scale / 100),
        })
      );
    }
  }

  private keyEvent(keyCode: number, state: InputState) {
    if (this.keyboard) {
      this.props.client.send(
        new KeyMessage({
          keyCode,
          state,
        })
      );
    }
  }
}

export default withClient(Stream);