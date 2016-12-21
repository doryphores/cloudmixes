import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { selectTrack } from '../actions';
import Track from './track';

const TrackList = ({ className, tracks, onTrackSelect }) => (
  <div className={classnames("track-list", className)}>
    {tracks.map(track => (
      <Track key={track.id} track={track} onSelect={onTrackSelect} />
    ))}
  </div>
);

function mapStateToProps(state) {
  return { tracks: state.tracks };
}

function mapDispatchToProps(dispatch) {
  return {
    onTrackSelect: (trackID) => dispatch(selectTrack(trackID))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackList);
