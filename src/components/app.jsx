import React from 'react'

import SettingsPanel from './settings_panel'
import TrackList from './track_list'
import Player from './player'

const App = () => (
  <div className='u-flex u-flex--full u-flex--vertical'>
    <SettingsPanel className='u-flex__panel' />
    <TrackList className='u-flex__panel u-flex__panel--grow' />
    <Player className='u-flex__panel' />
  </div>
)

export default App
