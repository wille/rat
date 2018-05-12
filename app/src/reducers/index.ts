import { combineReducers } from 'redux';

import client from './client';
import fs from './fs';
import processes from './processes';
import screen from './screen';
import subscriptions from './subscription';
import transfers from './transfers';

export * from './client';
export * from './subscription';
export * from './processes';
export * from './fs';
export * from './screen';
export * from './transfers';

const rootReducer = combineReducers({
  client,
  subscriptions,
  processes,
  fs,
  screen,
  transfers,
});

export default rootReducer;
