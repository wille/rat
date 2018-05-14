import * as React from 'react';
import { connect } from 'react-redux';
import withProps from 'recompose/withProps';
import { MessageType } from 'shared/types';

import { subscribe, unsubscribe } from '../actions/subscription';
import {
  clientHandler,
  directoryHandler,
  MessageHandler,
  processHandler,
  screenHandler,
} from '../messages';

interface Props {
  type: MessageType;
  handler: MessageHandler;
  subscribe: typeof subscribe;
  unsubscribe: typeof unsubscribe;
}

class Handler extends React.Component<Props> {
  state = {
    subscription: null,
  };

  componentDidMount() {
    const { type, handler, subscribe } = this.props;
    subscribe(type, handler);
  }

  componentWillUnmount() {
    const { unsubscribe } = this.props;
    unsubscribe(this.state.subscription);
  }

  render() {
    return this.props.children;
  }
}

const ConnectedHandler = connect(null, {
  subscribe,
  unsubscribe,
})(Handler);

const ClientSubscription = withProps({
  type: MessageType.Client,
  handler: clientHandler,
})(ConnectedHandler);

const DirectorySubscription = withProps({
  type: MessageType.Directory,
  handler: directoryHandler,
})(ConnectedHandler);

const ScreenSubscription = withProps({
  type: MessageType.Screen,
  handler: screenHandler,
})(ConnectedHandler);

const ProcessSubscription = withProps({
  type: MessageType.Process,
  handler: processHandler,
})(ConnectedHandler);

export {
  ClientSubscription,
  DirectorySubscription,
  ScreenSubscription,
  ProcessSubscription,
};
