import { combineReducers } from 'redux';
import client from './client';
import subscriptions from './subscription';
import processes from './processes';

export * from './client';
export * from './subscription';
export * from './processes';

const rootReducer = combineReducers({
  client,
  subscriptions,
  processes,
});

export default rootReducer;
