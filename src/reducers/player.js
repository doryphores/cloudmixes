import {
  SELECT_TRACK, PLAYER_TIME_CHANGED, PLAYER_STATE_CHANGED
} from '../actions';

const initialState = {
  trackID: null,
  currentTime: 0,
  status: 'idle'
};

export function player(state = initialState, action) {
  switch (action.type) {
    case SELECT_TRACK:
      if (state.trackID == action.payload) return state;
      
      return {
        trackID: action.payload,
        currentTime: 0,
        status: 'idle'
      };
    case PLAYER_TIME_CHANGED:
      return Object.assign({}, state, {
        currentTime: action.payload
      });
    case PLAYER_STATE_CHANGED:
      return Object.assign({}, state, {
        status: action.payload
      });
    default:
      return state;
  }
}
 
