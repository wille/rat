import {
  addClients,
  initClients,
  removeClient,
  updateClient,
} from '@app/actions';
import store from '../';
import {
  ClientTemplate,
  ClientUpdateType,
  MessageTemplate,
} from '../../../shared/src/templates';
import Client from '../client';
import Connections from '../components/Clients';
import ControlSocket from '../control';

export default (data: ClientTemplate) => {
  switch (data.type) {
    case ClientUpdateType.ADD:
      store.dispatch(addClients(data));
      if (data.initial) {
        store.dispatch(initClients());
      }
      break;
    case ClientUpdateType.UPDATE:
      store.dispatch(updateClient(data));
      break;
    case ClientUpdateType.REMOVE:
      store.dispatch(removeClient(data));
      break;
  }
};
