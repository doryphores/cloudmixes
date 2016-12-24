import {
  SELECT_TRACK, PLAYER_TIME_CHANGED, PLAYER_STATE_CHANGED
} from '../actions';

const initialState = {
  trackID: null,
  currentTime: 0,
  playing: false,
  seeking: false,
  waiting: false
};

export function player(state = initialState, action) {
  switch (action.type) {
    case SELECT_TRACK:
      if (state.trackID == action.payload) return state;

      return Object.assign({}, initialState, {
        trackID: action.payload
      });
    case PLAYER_TIME_CHANGED:
      return Object.assign({}, state, {
        currentTime: action.payload
      });
    case PLAYER_STATE_CHANGED:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
