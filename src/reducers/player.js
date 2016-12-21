import { SELECT_TRACK, TRACK_PROGRESS, PLAYER_STATE_CHANGED } from '../actions';

const initialState = {
  trackID: null,
  currentTime: 0,
  paused: false
};

export function player(state = initialState, action) {
  switch (action.type) {
    case SELECT_TRACK:
      return {
        trackID: action.payload,
        progress: 0,
        paused: false
      };
    case TRACK_PROGRESS:
      return Object.assign({}, state, {
        currentTime: action.payload
      });
    case PLAYER_STATE_CHANGED:
      return Object.assign({}, state, {
        paused: action.payload
      });
    default:
      return state;
  }
}
 
