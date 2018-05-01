import { resetFps } from './actions';

export default store => {
  setInterval(() => {
    store.dispatch(resetFps());
  }, 1000);
};
