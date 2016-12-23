import { SAVE_SETTINGS } from '../actions';

const initialState = {
  username: '',
  minTrackLength: 30
};

export function settings(state = initialState, action) {
  switch(action.type) {
    case SAVE_SETTINGS:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
