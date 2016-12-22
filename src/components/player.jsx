import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { formatDuration } from '../utils';
import { PLAY, PAUSE } from '../actions';

const Player = ({ onPlay, onPause, playing, progress, track, className }) => {
  if (!track) return null;
  return (
    <div className={classnames('player u-flex u-flex--horizontal', className)}>
      <div className="player__control u-flex__panel"
        onClick={playing ? onPause : onPlay}>
        <i className="material-icons md-24">
          {playing ? "pause" : "play_arrow"}
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
      progress: (state.player.currentTime || 0) / track.duration,
      playing: state.player.status == 'playing'
    };
  }

  return {
    track: null,
    progress: 0,
    playing: false
  }
}

function findTrack(tracks, id) {
  return id && tracks.find(t => t.id == id);
}

function mapDispatchToProps(dispatch) {
  return {
    onPlay: () => dispatch({ type: PLAY }),
    onPause: () => dispatch({ type: PAUSE })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
