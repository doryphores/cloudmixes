import * as Actions from '../actions';
import API from './api';

const api = new API();

export const middleware = (store) => (next) => (action) => {
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
      return next(action);
      break;
    case Actions.SELECT_TRACK:
      if (action.payload == player.trackID) {
        store.dispatch({ type: Actions.TOGGLE_PLAY });
        return next(action);
      } else {
        api.loadTrack(action.payload).then(() => next(action));
      }
      break;
    case Actions.PLAY:
      api.play(player.trackID, player.currentTime);
      return next(action);
      break;
    case Actions.PAUSE:
      api.pause();
      return next(action);
      break;
    case Actions.TOGGLE_PLAY:
      store.dispatch({
        type: Actions[player.playing ? 'PAUSE' : 'PLAY']
      });
      return next(action);
      break;
    case Actions.SEEK:
      api.seek(action.payload);
      return next(action);
      break;
    default:
      return next(action);
  }
};

export const connectToStore = (store) => {
  api.on('time', (currentTime) => {
    store.dispatch({
      type:    Actions.PLAYER_TIME_CHANGED,
      payload: currentTime
    });
  });

  api.on('state-change', (states) => {
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
