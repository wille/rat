import ControlSocket from '@app/control';
import SubscribeMessage from 'shared/messages/subscribe';
import { Action } from '../constants';

const initialState = {
  list: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.PROCESS_SET_LIST:
      return {
        ...state,
        list: action.payload,
      }
    default:
      return state;
  }
};

export const selectProcessList = state => state.processes.list;
