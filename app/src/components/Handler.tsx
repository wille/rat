import { MessageType } from '@shared/types';
import * as React from 'react';
import { connect } from 'react-redux';

import { subscribe, unsubscribe } from '@app/actions/subscription';

interface Props {
  type: MessageType;
  handler: () => any;
  subscribe: any;
  unsubscribe: any;
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

export default connect(() => ({}), {
  subscribe,
  unsubscribe,
})(Handler);
