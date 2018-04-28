import { combineReducers } from 'redux';
import client from './client';
import subscriptions from './subscription';

export * from './client';
export * from './subscription';

const rootReducer = combineReducers({
  client,
  subscriptions,
});

export default rootReducer;
