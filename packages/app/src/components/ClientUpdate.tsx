import Client from '..//client';
import * as React from 'react';

interface Props {
  client: Client;
  onUpdate: () => void;
}

interface State {
  unsubscribe: () => void;
}

class ClientUpdate extends React.PureComponent<Props, State> {
  componentDidMount() {
    const { client, onUpdate } = this.props;
    this.setState({
      unsubscribe: client.subscribe(onUpdate),
    });
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  render() {
    return this.props.children;
  }
}

export default ClientUpdate;
