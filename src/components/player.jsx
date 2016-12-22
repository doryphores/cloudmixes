import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { formatDuration } from '../utils';
import { PLAY, PAUSE, SEEK } from '../actions';
import Scrubber from './scrubber';

const Player = ({ onPlay, onPause, onSeek, playing, progress, track, className }) => {
  if (!track) return null;
  return (
    <div className={classnames("player u-flex u-flex--horizontal", className)}>
      <div className="player__control u-flex__panel"
        onClick={playing ? onPause : onPlay}>
        <i className="material-icons md-36">
          {playing ? "pause" : "play_arrow"}
        </i>
      </div>
      <div className="player__meta u-flex__panel u-flex__panel--grow u-flex u-flex--vertical">
        <div className="player__title u-flex__panel">
          {track.title}
        </div>
        <Scrubber className="player__scrubber u-flex__panel u-flex__panel u-flex__panel--grow"
          progress={progress}
          duration={track.duration}
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
    onPause: () => dispatch({ type: PAUSE }),
    onSeek: (time) => dispatch({ type: SEEK, payload: time })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
