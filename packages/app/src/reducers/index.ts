import { combineReducers } from 'redux';

import client from './client';
import processes from './processes';
import subscriptions from './subscription';
import transfers from './transfers';

export * from './client';
export * from './subscription';
export * from './processes';
export * from './transfers';

const rootReducer = combineReducers({
  client,
  subscriptions,
  processes,
  transfers,
});

export default rootReducer;
