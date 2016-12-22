// Actions

export const REFRESH_TRACKS = 'REFRESH_TRACKS';
export const LOAD_TRACKS = 'LOAD_TRACKS';

export const SELECT_TRACK = 'SELECT_TRACK';
export const TOGGLE_PLAY = 'TOGGLE_PLAY';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const SEEK = 'SEEK';

export const PLAYER_TIME_CHANGED = 'PLAYER_TIME_CHANGED';
export const PLAYER_STATE_CHANGED = 'PLAYER_STATE_CHANGED';

// Action creators

export function selectTrack(trackID) {
  return {
    type: SELECT_TRACK,
    payload: trackID
  };
}

export function loadTracks(payload) {
  return {
    type: LOAD_TRACKS,
    payload: payload
  };
}
