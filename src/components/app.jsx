import React from 'react';
import { connect } from 'react-redux';

import { refreshTracks } from '../actions';

import TrackList from './track_list';

const App = ({ tracks, onRefreshClick }) => (
  <div className="u-flex u-flex--vertical">
    <header className="u-flex__panel u-flex u-flex--horizontal toolbar">
      <h1 className="u-flex__panel u-flex__panel--grow">Cloud mixes</h1>
      <button onClick={onRefreshClick}>Refresh</button>
    </header>
    <TrackList tracks={tracks} className="u-flex__panel u-flex__panel--grow" />
  </div>
);

function mapStateToProps(state) {
  return { tracks: state.tracks };
}

function mapDispatchToProps(dispatch) {
  return {
    onRefreshClick: () => dispatch(refreshTracks())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
