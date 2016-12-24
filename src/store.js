import  { createStore, combineReducers, applyMiddleware } from 'redux';
import { outputJSONSync, readJSON } from 'fs-extra';
import path from 'path';

import * as reducers from './reducers';

const CACHE_PATH = path.join(
  require('electron').remote.app.getPath('userData'),
  'cache',
  'store.json'
);

export function configureStore(...middleware) {
  return new Promise((resolve, reject) => {
    readJSON(CACHE_PATH, (_, data) => {
      try {
        let store = createStore(
          combineReducers(reducers),
          sanitizeInitialState(data),
          applyMiddleware(...middleware)
        );

        window.addEventListener('beforeunload', () => {
          outputJSONSync(CACHE_PATH, store.getState());
        });

        resolve(store);
      } catch(err) {
        reject(err);
      }
    });
  });
}

function sanitizeInitialState(state) {
  if (state && state.player) {
    state.player = Object.assign(state.player, {
      playing: false,
      seeking: false,
      waiting: false
    });
  }
  return state;
}
