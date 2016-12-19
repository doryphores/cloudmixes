import React from 'react';
import { connect } from 'react-redux';

import { refreshTracks } from '../actions';

import TrackList from './track_list';

const App = ({ tracks, onRefreshClick }) => (
  <div>
    <h1>Cloud mixes</h1>
    <button onClick={onRefreshClick}>Refresh</button>
    <TrackList tracks={tracks} />
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
