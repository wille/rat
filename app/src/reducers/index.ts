import { combineReducers } from 'redux';

import client from './client';
import subscriptions from './subscription';
import processes from './processes';
import fs from './fs';

export * from './client';
export * from './subscription';
export * from './processes';
export * from './fs';

const rootReducer = combineReducers({
  client,
  subscriptions,
  processes,
  fs,
});

export default rootReducer;
