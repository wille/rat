import {
  addClients,
  initClients,
  removeClient,
  updateClient,
} from '..//actions';

import { ClientTemplate, ClientUpdateType } from 'shared/templates';
import store from '../';

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
