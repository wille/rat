import Client from '@app/client';
import { ClientTemplate } from '@shared/templates';

export const addClient = (data: ClientTemplate) => ({
  type: 'ADD_CLIENT',
  payload: new Client(data.id, data.host, data),
});

export const removeClient = (client: { _id?: string }) => ({
  type: 'REMOVE_CLIENT',
  payload: client,
});

export const updateClient = (data: ClientTemplate) => ({
  type: 'UPDATE_CLIENT',
  payload: {
    data,
  },
});

export const setClient = (client: Client) => ({
  type: 'SET_CLIENT',
  payload: client,
});
