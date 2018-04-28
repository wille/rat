import { Action } from '../constants';

const initialState = {
  frame: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.SCREEN_SET_FRAME:
      return {
        ...state,
        frame: action.payload,
      };
    default:
      return state;
  }
};

export const selectScreenBuffer = state => state.screen.frame;
