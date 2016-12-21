import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { formatDuration } from '../utils';
import { togglePlay } from '../actions';

const Player = ({ onTogglePlay, paused = false, progress = 0, track, className }) => {
  if (!track) return null;
  return (
    <div className={classnames('player u-flex u-flex--horizontal', className)}>
      <div className="player__control u-flex__panel" onClick={onTogglePlay}>
        <i className="material-icons md-24">
          {paused ? "play_arrow" : "pause"}
        </i>
      </div>
      <div className="player__scrubber u-flex__panel u-flex__panel--grow"
        style={{ backgroundSize: `${progress * 100}% 100%` }}>
        <span className="player__scrubber-mask"
          style={{ WebkitMaskBoxImage: `url(${track.waveform_url})` }} />
        <span className="player__progress">
          {formatDuration(track.duration * progress)}
        </span>
        <span className="player__duration">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
};

function scrubberStyles(progress) {
  return {
    backgroundSize: `${progress * 100}% 100%`
  };
}

function mapStateToProps(state) {
  let track = findTrack(state.tracks, state.player.trackID);

  if (track) {
    return {
      track: track,
      progress: state.player.currentTime / track.duration,
      paused: state.player.paused
    };
  }

  return {
    track: null,
    paused: false,
    progress: 0
  }
}

function findTrack(tracks, id) {
  return id && tracks.find(t => t.id == id);
}

function mapDispatchToProps(dispatch) {
  return {
    onTogglePlay: () => dispatch(togglePlay())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
