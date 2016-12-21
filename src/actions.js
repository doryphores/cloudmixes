// Actions

export const REFRESH_TRACKS = 'REFRESH_TRACKS';
export const LOAD_TRACKS = 'LOAD_TRACKS';
export const SELECT_TRACK = 'SELECT_TRACK';
export const TRACK_PROGRESS = 'TRACK_PROGRESS';
export const TOGGLE_PLAY = 'TOGGLE_PLAY';
export const PLAYER_STATE_CHANGED = 'PLAYER_STATE_CHANGED';

// Action creators

export function selectTrack(trackID) {
  return {
    type: SELECT_TRACK,
    payload: trackID
  };
}

export function playerStateChanged(paused) {
  return {
    type: PLAYER_STATE_CHANGED,
    payload: paused
  };
}

export function trackProgress(progress) {
  return {
    type: TRACK_PROGRESS,
    payload: progress
  };
}

export function togglePlay() {
  return {
    type: TOGGLE_PLAY
  };
}

export function refreshTracks() {
  return {
    type: REFRESH_TRACKS
  };
}

export function loadTracks(payload) {
  return {
    type: LOAD_TRACKS,
    payload: payload
  };
}
