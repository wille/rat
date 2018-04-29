import { Action } from '../constants';

const initialState = {
  current: null,
  loading: true,
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
      localStorage.setItem('currentClient', action.payload.id);
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
      const currentId = localStorage.getItem('currentClient');
      console.log(currentId);
      return {
        ...state,
        loading: false,
        current: state.list.find(client => client.id === currentId),
      };
    default:
      return state;
  }
};

export const selectClients = state => state.client.list;
export const selectClient = state => state.client.current;
export const selectIsLoadingClients = state => state.client.loading;
