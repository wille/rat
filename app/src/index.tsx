import '@app/styles/menu.scss';
import '@app/styles/split.scss';
import 'bootstrap/dist/css/bootstrap.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App';
import ControlSocket from './control';

ControlSocket.connect();

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root')
);
