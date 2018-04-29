import { Action } from '../constants';

const initialState = {
  isLoading: true,
  current: null,
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
        isLoading: false,
      };
    default:
      return state;
  }
};

export const selectClients = state => state.client.list;
export const selectClient = state => state.client.current;
export const selectIsLoadingClients = state => state.client.isLoading;
