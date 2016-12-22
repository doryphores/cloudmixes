import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './store';
import { middleware, connectToStore } from './soundcloud/adapter';
import App from './components/app';

export function start(container) {
  configureStore(middleware).then((store) => {
    connectToStore(store);

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      container
    );
  });
}
