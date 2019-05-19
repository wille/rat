import { ClientTemplate } from 'shared/templates';
import Client from '..//client';
import { Action } from '../constants';

import { createAction } from 'redux-actions';

export const initClients = createAction(Action.CLIENTS_LIST_INIT);

export const addClients = createAction(Action.CLIENT_CONNECT, data => {
  if (!Array.isArray(data)) {
    data = [data];
  }
  return data.map(data => new Client(data.id, data.data.host, data.data));
});

export const removeClient = createAction<ClientTemplate>(
  Action.CLIENT_DISCONNECT
);

export const updateClient = createAction<ClientTemplate>(Action.CLIENT_UPDATE);

export const resetClients = createAction(Action.CLIENTS_RESET);
