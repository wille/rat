const initialState = {
  client: null,
  clients: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload],
      };
    case 'UPDATE_CLIENT':
      state.clients
        .filter(c => c.id === action.payload.data.id)
        .forEach(c => c.update(action.payload.data));

      return state;
    case 'SET_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(c => c.id !== action.payload.id),
      };
    default:
      return state;
  }
};

export const selectClients = state => state.clients.clients;

export const selectClient = state => state.clients.client;
