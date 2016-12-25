import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { SELECT_TRACK } from '../actions';
import Track from './track';

const TrackList = ({ className, tracks, selectedTrackID }) => (
  <ReactCSSTransitionGroup component="div"
      className={classnames("track-list", className)}
      transitionName="track-"
      transitionEnterTimeout={200}
      transitionLeaveTimeout={200}>
    {tracks.map(track => (
      <Track key={track.id}
        track={track}
        selected={track.id == selectedTrackID} />
    ))}
  </ReactCSSTransitionGroup>
);

function mapStateToProps(state) {
  return {
    tracks:          filterTracks(state),
    selectedTrackID: state.player.trackID
  };
}

function filterTracks(state) {
  let tracks = state.tracks;
  return (state.settings.blacklist.length == 0)
    ? state.tracks
    : tracks.filter(t => !state.settings.blacklist.includes(t.id));
}

export default connect(mapStateToProps)(TrackList);
