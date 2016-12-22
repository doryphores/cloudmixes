import  { createStore, combineReducers, applyMiddleware } from 'redux';
import { outputJSON, readJSON } from 'fs-extra';
import path from 'path';

import * as reducers from './reducers';

const CACHE_PATH = path.join(
  require('electron').remote.app.getPath('userData'),
  'cache',
  'store.json'
);

export function configureStore(...middleware) {
  return new Promise((resolve, reject) => {
    readJSON(CACHE_PATH, (_, data = {}) => {
      try {
        let store = createStore(
          combineReducers(reducers),
          sanitizeInitialState(data),
          applyMiddleware(...middleware)
        );

        store.subscribe(() => outputJSON(CACHE_PATH, store.getState()));

        resolve(store);
      } catch(err) {
        reject(err);
      }
    });
  });
}

function sanitizeInitialState(state) {
  if (state.player) {
    state.player.status = 'idle';
  }
  return state;
}
