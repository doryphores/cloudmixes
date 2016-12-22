import * as Actions from '../actions';
import API from './api';

const api = new API();

export const middleware = (store) => (next) => (action) => {
  switch(action.type) {
    case Actions.REFRESH_TRACKS:
      api.fetchTracks().then((tracks) => {
        store.dispatch(Actions.loadTracks(tracks));
      });
      return next(action);
      break;
    case Actions.SELECT_TRACK:
      api.loadTrack(action.payload).then(() => next(action));
      break;
    case Actions.PLAY:
      api.play(store.getState().player.trackID, store.getState().player.currentTime);
      return next(action);
      break;
    case Actions.PAUSE:
      api.pause();
      return next(action);
      break;
    case Actions.TOGGLE_PLAY:
      if (!store.getState().player.trackID) return;
      if (store.getState().player.status == 'playing') store.dispatch({ type: Actions.PAUSE });
      else store.dispatch({ type: Actions.PLAY });
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
      type: Actions.PLAYER_TIME_CHANGED,
      payload: currentTime
    });
  });

  api.on('state-change', (state) => {
    store.dispatch({
      type: Actions.PLAYER_STATE_CHANGED,
      payload: state
    });
  });
}
