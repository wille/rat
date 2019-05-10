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
  transfersHandler,
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
    const { unsubscribe, type } = this.props;
    unsubscribe(type);
  }

  render() {
    return this.props.children;
  }
}

const ConnectedHandler = connect(
  null,
  {
    subscribe,
    unsubscribe,
  }
)(Handler);

const ClientSubscription = withProps({
  type: MessageType.Client,
  handler: clientHandler,
})(ConnectedHandler);

const DirectorySubscription = withProps({
  type: MessageType.Directory,
  handler: directoryHandler,
})(ConnectedHandler);

const ProcessSubscription = withProps({
  type: MessageType.Process,
  handler: processHandler,
})(ConnectedHandler);

const TransferSubscription = withProps({
  type: MessageType.Transfers,
  handler: transfersHandler,
})(ConnectedHandler);

export {
  ConnectedHandler as Subscriber,
  ClientSubscription,
  DirectorySubscription,
  ProcessSubscription,
  TransferSubscription,
};
