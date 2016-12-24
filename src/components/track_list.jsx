import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { SELECT_TRACK } from '../actions';
import Track from './track';

const TrackList = ({ className, tracks, selectedTrackID, playing, onTrackSelect }) => (
  <div className={classnames("track-list", className)}>
    {tracks.map(track => (
      <Track key={track.id}
        track={track}
        playing={track.id == selectedTrackID && playing}
        active={track.id == selectedTrackID}
        onSelect={onTrackSelect} />
    ))}
  </div>
);

function mapStateToProps(state) {
  return {
    tracks:          state.tracks,
    playing:         state.player.playing,
    selectedTrackID: state.player.trackID
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onTrackSelect: (trackID) => dispatch({
      type: SELECT_TRACK,
      payload: trackID
    })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackList);
