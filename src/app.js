import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { REFRESH_TRACKS, loadTracks } from  './actions';
import { configureStore } from './store';
import SoundCloud from './services/soundcloud';
import App from './components/app';

const sc = new SoundCloud();

const scInterface = (store) => (next) => (action) => {
  switch(action.type) {
    case REFRESH_TRACKS:
      sc.fetchTracks().then((tracks) => {
        store.dispatch(loadTracks(tracks));
      });
      break;
    default:
      // Do nothing
  }
  return next(action);
}

const store = configureStore({}, scInterface);

export function start(container) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    container
  );
}
