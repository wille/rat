import { Action } from '../constants';

const initialState = {
  current: null,
  list: [],
  filesList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.CLIENT_CONNECT:
      return {
        ...state,
        list: [...state.list, action.payload],
      };
    case Action.CLIENT_UPDATE:
      state.list
        .filter(c => c.id === action.payload.id)
        .forEach(c => c.update(action.payload));

      return state;
    case Action.SET_CURRENT_CLIENT:
      return {
        ...state,
        current: action.payload,
      };
    case Action.CLIENT_DISCONNECT:
      return {
        ...state,
        clients: state.list.filter(c => c.id !== action.payload.id),
      };
    default:
      return state;
  }
};

export const selectClients = state => state.client.list;

export const selectClient = state => state.client.current;
