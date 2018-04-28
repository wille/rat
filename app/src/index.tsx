import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { AppContainer } from 'react-hot-loader';
import App from './App';
import ControlSocket from './control';
import reducers from './reducers';

ControlSocket.connect();

const store = createStore(reducers);
export default store;

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);
