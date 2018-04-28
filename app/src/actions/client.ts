import Client from '@app/client';
import { ClientTemplate } from '@shared/templates';
import { Action } from '../constants';
import { FileEntry } from '@shared/templates';

export const addClient = (data: ClientTemplate) => ({
  type: Action.CLIENT_CONNECT,
  payload: new Client(data.id, data.host, data),
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

export const setFilesList = (list: FileEntry[]) => ({
  type: Action.SET_FILE_LIST,
  payload: list,
})
