// Actions

export const REFRESH_TRACKS = 'REFRESH_TRACKS';
export const LOAD_TRACKS = 'LOAD_TRACKS';


// Action creators

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
