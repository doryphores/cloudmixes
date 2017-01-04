import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ipcRenderer } from 'electron'

import { configureStore } from './store'
import { middleware, connectToStore } from './soundcloud/adapter'
import App from './components/app'
import { REFRESH_TRACKS, TOGGLE_PLAY } from './actions'

export function start (container) {
  configureStore(middleware).then((store) => {
    connectToStore(store)

    ipcRenderer.on('refresh', () => {
      store.dispatch({ type: REFRESH_TRACKS })
    })

    ipcRenderer.on('togglePlay', () => {
      store.dispatch({ type: TOGGLE_PLAY })
    })

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      container
    )
  })
}
