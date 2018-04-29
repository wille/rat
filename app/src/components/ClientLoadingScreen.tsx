import { selectLoadingClient } from '@app/reducers';
import * as React from 'react';
import { connect } from 'react-redux';

const LoadingScreen = ({ loading }) => <p>Loading {loading.host}</p>;

export default connect(state => ({
  loading: selectLoadingClient(state),
}))(LoadingScreen);
