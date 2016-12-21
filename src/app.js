import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {
  REFRESH_TRACKS, TOGGLE_PLAY, SELECT_TRACK,
  loadTracks, trackProgress, playerStateChanged
} from  './actions';
import { configureStore } from './store';
import SoundCloud from './services/soundcloud';
import App from './components/app';

const sc = new SoundCloud();

let player;

const scInterface = (store) => (next) => (action) => {
  switch(action.type) {
    case REFRESH_TRACKS:
      sc.fetchTracks().then((tracks) => {
        store.dispatch(loadTracks(tracks));
      });
      break;
    case SELECT_TRACK:
      sc.loadTrack(action.payload).then(p => {
        player = p;
        player.on('time', (time) => {
          store.dispatch(trackProgress(player.currentTime()));
        });
        player.on('pause', (time) => {
          store.dispatch(playerStateChanged(true));
        });
        player.on('play-resume', (time) => {
          store.dispatch(playerStateChanged(false));
        });
        player.play();
      });
      break;
    case TOGGLE_PLAY:
      player[store.getState().player.paused ? 'play' : 'pause']();
      break;
    default:
      // Do nothing
  }
  return next(action);
}

export function start(container) {
  configureStore(scInterface).then((store) => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      container
    );
  });
}
