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
  let tracks = state.tracks;
  if (state.settings.blacklist.length) {
    tracks = tracks.filter(t => !state.settings.blacklist.includes(t.id));
  }
  return {
    tracks,
    selectedTrackID: state.player.trackID
  };
}

export default connect(mapStateToProps)(TrackList);
