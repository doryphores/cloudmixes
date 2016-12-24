import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { SELECT_TRACK } from '../actions';
import Track from './track';

const TrackList = ({ className, tracks, selectedTrackID }) => (
  <div className={classnames("track-list", className)}>
    {tracks.map(track => (
      <Track key={track.id}
        track={track}
        selected={track.id == selectedTrackID} />
    ))}
  </div>
);

function mapStateToProps(state) {
  return {
    tracks:          state.tracks,
    selectedTrackID: state.player.trackID
  };
}

export default connect(mapStateToProps)(TrackList);
