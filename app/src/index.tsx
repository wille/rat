import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ControlSocket from './control';
import reducers from './reducers';

import fpsCounter from './fps-counter';

ControlSocket.connect();

const store = createStore(reducers);
export default store;

fpsCounter(store);

ReactDOM.render(
  <BrowserRouter>
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>
  </BrowserRouter>,
  document.getElementById('root')
);
