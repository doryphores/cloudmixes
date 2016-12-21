import React from 'react';

import Toolbar from './toolbar';
import TrackList from './track_list';
import Player from './player';

const App = ({ tracks, onRefreshClick }) => (
  <div className="u-flex u-flex--full u-flex--vertical">
    <Toolbar className="u-flex__panel" />
    <TrackList className="u-flex__panel u-flex__panel--grow" />
    <Player className="u-flex__panel" />
  </div>
);

export default App;
