import { SAVE_SETTINGS, BLACKLIST_TRACK, RESTORE } from '../actions';

const initialState = {
  username:       '',
  minTrackLength: 30,
  blacklist:      []
};

export function settings(state = initialState, action) {
  switch(action.type) {
    case SAVE_SETTINGS:
      return Object.assign({}, state, action.payload);
    case BLACKLIST_TRACK:
      return Object.assign({}, state, {
        blacklist: state.blacklist.concat(action.payload)
      });
    case RESTORE:
      return Object.assign(initialState, state);
    default:
      return state;
  }
}
