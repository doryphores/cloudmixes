import * as Actions from '../actions';
import API, { EVENTS } from './api';

const api = new API();

export const middleware = store => next => action => {
  let player = store.getState().player;

  switch(action.type) {
    case Actions.REFRESH_TRACKS:
      api.fetchTracks(
        store.getState().settings.username,
        store.getState().settings.minTrackLength
      ).then((tracks) => {
        store.dispatch({
          type:    Actions.LOAD_TRACKS,
          payload: tracks
        });
      });
      break;
    case Actions.TOGGLE_PLAY:
      let trackID = action.payload || player.trackID;

      if (api.trackIsLoaded(trackID)) {
        // loaded
        api.togglePlay(trackID);
      } else if (!action.payload || action.payload == player.trackID) {
        // selected
        api.togglePlay(trackID, player.currentTime);
      } else {
        api.togglePlay(action.payload);
      }
      break;
    case Actions.BLACKLIST_TRACK:
      api.unloadTrack(action.payload);
      break;
    case Actions.SEEK:
      api.seek(action.payload);
      break;
  }

  return next(action);
};

export const connectToStore = (store) => {
  api.on(EVENTS.TRACK.LOADED, (trackID) => {
    store.dispatch({
      type:    Actions.TRACK_LOADED,
      payload: trackID
    });
  });

  api.on(EVENTS.PLAYER.TIME_CHANGED, (currentTime) => {
    store.dispatch({
      type:    Actions.PLAYER_TIME_CHANGED,
      payload: currentTime
    });
  });

  api.on(EVENTS.PLAYER.STATE_CHANGED, (states) => {
    console.info(
      "Player state changed. playing: %s, seeking: %s, waiting: %s",
      states.playing, states.seeking, states.waiting
    );
    store.dispatch({
      type:    Actions.PLAYER_STATE_CHANGED,
      payload: states
    });
  });
}
