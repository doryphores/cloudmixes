import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { formatDuration } from '../utils';
import { PLAY, PAUSE, SEEK } from '../actions';
import Scrubber from './scrubber';

const Player = ({ onPlay, onPause, onSeek, playing, paused, waiting, seeking, progress, track, className }) => {
  if (!track) return null;
  return (
    <div className={classnames("player u-flex u-flex--horizontal", className)}>
      <div className={buttonClassNames("player__control u-flex__panel", playing, paused, waiting)}
        onClick={playing ? onPause : onPlay}>
        <i className="player__control-icon material-icons md-36">
          {playing ? "pause" : "play_arrow"}
        </i>
        <span className="player__control-loader wait-indicator">
          <span className="wait-indicator__dot" />
          <span className="wait-indicator__dot" />
          <span className="wait-indicator__dot" />
        </span>
      </div>
      <div className="player__meta u-flex__panel u-flex__panel--grow u-flex u-flex--vertical">
        <div className="player__title u-flex__panel">
          {track.title}
        </div>
        <Scrubber className="player__scrubber u-flex__panel u-flex__panel u-flex__panel--grow"
          progress={progress}
          duration={track.duration}
          seeking={seeking}
          onSeek={onSeek}>
          <span className="player__scrubber-mask"
            style={{ WebkitMaskBoxImage: `url(${track.waveform_url})` }} />
          <span className="player__duration">
            {formatDuration(track.duration)}
          </span>
        </Scrubber>
      </div>
    </div>
  );
};

function buttonClassNames(className, playing, paused, waiting) {
  return classnames(className, {
    'player__control--playing': playing,
    'player__control--paused':  paused,
    'player__control--waiting': waiting
  });
}

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
      playing:  ['playing', 'seeking'].includes(state.player.status),
      paused:   state.player.status == 'paused',
      seeking:  state.player.status == 'seeking',
      waiting:  state.player.status == 'loading'
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
    onPause: () => dispatch({ type: PAUSE }),
    onSeek: (time) => dispatch({ type: SEEK, payload: time })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
