import Client from '@app/client';
import { ClientTemplate } from 'shared/templates';
import { Action } from '../constants';

import { createAction } from 'redux-actions';

export const initClients = createAction(Action.CLIENTS_LIST_INIT);

export const addClients = createAction(Action.CLIENT_CONNECT, data => {
  if (!Array.isArray(data)) {
    data = [data];
  }
  return data.map(data => new Client(data.id, data.host, data));
});

export const removeClient = createAction<ClientTemplate>(
  Action.CLIENT_DISCONNECT
);

export const updateClient = createAction<ClientTemplate>(Action.CLIENT_UPDATE);
