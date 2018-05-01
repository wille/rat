import { combineReducers } from 'redux';

import client from './client';
import fs from './fs';
import processes from './processes';
import screen from './screen';
import subscriptions from './subscription';

export * from './client';
export * from './subscription';
export * from './processes';
export * from './fs';
export * from './screen';

const rootReducer = combineReducers({
  client,
  subscriptions,
  processes,
  fs,
  screen,
});

export default rootReducer;
