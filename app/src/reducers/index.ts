import { combineReducers } from 'redux';
import clients from './clients';
import subscriptions from './subscription';

const rootReducer = combineReducers({
  clients,
  subscriptions,
});

export default rootReducer;
