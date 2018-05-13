import { ScreenFrameTemplate } from 'shared/templates';
import store from '..';
import { setScreenFrame } from '..//actions/screen';

export default (data: ScreenFrameTemplate) => {
  store.dispatch(setScreenFrame(data));
};
