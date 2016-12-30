import {
  TRACK_LOADED, PLAYER_TIME_CHANGED, PLAYER_STATE_CHANGED,
  RESTORE, BLACKLIST_TRACK
} from "../actions";

const initialState = {
  trackID:     null,
  currentTime: 0,
  playing:     false,
  seeking:     false,
  waiting:     false
};

export function player(state = initialState, action) {
  switch (action.type) {
    case TRACK_LOADED:
      if (state.trackID == action.payload) return state;

      return Object.assign(state, {
        trackID:     action.payload,
        currentTime: action.payload == state.trackID ? state.currentTime : 0,
        playing:     false,
        seeking:     false,
        waiting:     true
      });
    case PLAYER_TIME_CHANGED:
      return Object.assign({}, state, {
        currentTime: action.payload
      });
    case PLAYER_STATE_CHANGED:
      return Object.assign({}, state, action.payload);
    case BLACKLIST_TRACK:
      if (action.payload == state.trackID) {
        return Object.assign({}, initialState);
      }
      return state;
    case RESTORE:
      return Object.assign({}, initialState, state, {
        playing: false,
        seeking: false,
        waiting: false
      });
    default:
      return state;
  }
}
