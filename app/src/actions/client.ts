import Client from '@app/client';
import { ClientTemplate } from '@shared/templates';
import { Action } from '../constants';

export const initClients = () => ({
  type: Action.CLIENTS_LIST_INIT,
});

export const addClients = (...data: ClientTemplate[]) => ({
  type: Action.CLIENT_CONNECT,
  payload: data.map(data => new Client(data.id, data.host, data)),
});

export const removeClient = (client: { _id?: string }) => ({
  type: Action.CLIENT_DISCONNECT,
  payload: client,
});

export const updateClient = (data: ClientTemplate) => ({
  type: Action.CLIENT_UPDATE,
  payload: data,
});

export const setActiveClient = (client: Client) => ({
  type: Action.SET_CURRENT_CLIENT,
  payload: client,
});
