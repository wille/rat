import { Action } from '../constants';

const currentClient = localStorage.getItem('currentClient');

const initialState = {
  current: null,
  loading: currentClient ? JSON.parse(currentClient) : false,
  list: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.CLIENT_CONNECT:
      return {
        ...state,
        list: [...state.list, ...action.payload],
      };
    case Action.CLIENT_UPDATE:
      state.list
        .filter(c => c.id === action.payload.id)
        .forEach(c => c.update(action.payload));

      return { ...state };
    case Action.SET_CURRENT_CLIENT:
      localStorage.setItem(
        'currentClient',
        JSON.stringify({
          id: action.payload.id,
          host: action.payload.host,
        })
      );
      return {
        ...state,
        current: action.payload,
      };
    case Action.CLIENT_DISCONNECT:
      return {
        ...state,
        list: state.list.filter(c => c.id !== action.payload.id),
      };
    case Action.CLIENTS_LIST_INIT:
      return {
        ...state,
        loading: false,
        current: state.list.find(client => client.id === state.loading.id),
      };
    default:
      return state;
  }
};

export const selectClients = state => state.client.list;
export const selectClient = state => state.client.current;
export const selectLoadingClient = state => state.client.loading;
