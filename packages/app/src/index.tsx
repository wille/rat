import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ControlSocket from './control';
import reducers from './reducers';

import { ThemeProvider } from 'emotion-theming';
import theme from './theme';

ControlSocket.connect();

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

ReactDOM.render(
  <BrowserRouter>
    <AppContainer>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </AppContainer>
  </BrowserRouter>,
  document.getElementById('root')
);
