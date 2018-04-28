import { combineReducers } from 'redux';

import client from './client';
import subscriptions from './subscription';
import processes from './processes';
import fs from './fs';
import screen from './screen';

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
