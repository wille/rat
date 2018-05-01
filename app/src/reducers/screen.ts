import { Action } from '../constants';

const initialState = {
  frame: null,
  fps: 0,
  currentFps: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.SCREEN_SET_FRAME:
      return {
        ...state,
        frame: action.payload,
        currentFps: state.currentFps + 1,
      };
    case Action.SCREEN_RESET_FPS:
      return {
        ...state,
        fps: state.currentFps,
        currentFps: 0,
      }
    default:
      return state;
  }
};

export const selectScreenBuffer = state => state.screen.frame;
export const selectFps = state => state.screen.fps;
