import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { formatDuration } from '../utils';
import { TOGGLE_PLAY, SEEK } from '../actions';
import Scrubber from './scrubber';
import PlayButton from './play_button';

const Player = ({ onPlayButtonClick, onSeek, playing, waiting, seeking, progress, track, className }) => {
  if (!track) return null;

  return (
    <div className={classnames("player u-flex u-flex--horizontal", className)}>
      <PlayButton className="u-flex__panel player__button"
        playing={playing}
        waiting={waiting}
        size="large"
        onClick={onPlayButtonClick} />
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

function scrubberStyles(progress) {
  return {
    backgroundSize: `${progress * 100}% 100%`
  };
}

function mapStateToProps(state) {
  let track = findTrack(state.tracks, state.player.trackID);

  if (track) {
    return Object.assign({}, state.player, {
      track:    track,
      progress: (state.player.currentTime || 0) / track.duration
    });
  }

  return Object.assign({}, state.player, {
    track:    null,
    progress: 0
  });
}

function findTrack(tracks, id) {
  return id && tracks.find(t => t.id == id);
}

function mapDispatchToProps(dispatch) {
  return {
    onPlayButtonClick: () => dispatch({ type: TOGGLE_PLAY }),
    onSeek: (time) => dispatch({ type: SEEK, payload: time })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
