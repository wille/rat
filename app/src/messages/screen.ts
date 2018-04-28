import { ScreenFrameTemplate } from '@templates';
import store from '..';
import { setScreenFrame } from '@app/actions/screen';

export default (data: ScreenFrameTemplate) => {
  store.dispatch(setScreenFrame(data));
};
