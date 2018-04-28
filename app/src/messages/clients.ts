import { addClient, removeClient, updateClient } from '@app/actions';
import store from '../';
import {
  ClientTemplate,
  ClientUpdateType,
} from '../../../shared/src/templates';
import Client from '../client';
import Connections from '../components/Clients';
import ControlSocket from '../control';
import MessageHandler from './index';

class ClientHandler implements MessageHandler<ClientTemplate> {
  /* tslint:disable:no-shadowed-variable */
  public emit(data: ClientTemplate) {
    switch (data.type) {
      case ClientUpdateType.ADD:
        store.dispatch(addClient(data));
        break;
      case ClientUpdateType.UPDATE:
        store.dispatch(updateClient(data));
        break;
      case ClientUpdateType.REMOVE:
        store.dispatch(removeClient(data));
        break;
    }
  }
}

export default ClientHandler;
