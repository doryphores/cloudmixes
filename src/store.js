import  { createStore, combineReducers, applyMiddleware } from 'redux';

import * as reducers from './reducers';

export function configureStore(initialState = {}, ...middleware) {
  return createStore(
    combineReducers(reducers),
    initialState,
    applyMiddleware(...middleware)
  );
}
