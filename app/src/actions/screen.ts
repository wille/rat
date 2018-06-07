import { createAction } from 'redux-actions';
import { ScreenFrameTemplate } from 'shared/templates';
import { Action } from '..//constants';

export const setScreenFrame = createAction<ScreenFrameTemplate>(
  Action.SCREEN_SET_FRAME
);

export const resetFps = createAction(Action.SCREEN_RESET_FPS);
