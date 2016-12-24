import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import PlayButton from './play_button';
import { formatDuration } from '../utils';
import { SELECT_TRACK, TOGGLE_PLAY } from '../actions';

const Track = ({ track, selected, playing, waiting, onButtonClick }) => (
  <div className={trackClassNames(selected, playing)}>
    <div className="track__thumb u-flex__panel">
      <PlayButton className="track__button"
        size="small"
        playing={selected && playing}
        waiting={selected && waiting}
        onClick={onButtonClick} />
      <span className="track__artwork"
        style={artworkStyles(track.artwork_url)} />
    </div>
    <div className="track__meta u-flex__panel u-flex__panel--grow">
      <span className="track__meta-item track__title">{track.title}</span>
      <span className="track__meta-item track__duration">
        {formatDuration(track.duration)}
      </span>
      <span className="track__meta-item track__artist">{track.username}</span>
    </div>
  </div>
);

function trackClassNames(selected, playing) {
  return classnames('track-list__item track u-flex u-flex--horizontal', {
    'track--selected': selected,
    'track--playing':  playing
  });
}

function artworkStyles(artworkURL) {
  return artworkURL ? { backgroundImage: `url(${artworkURL})` } : {};
}

function mapStateToProps(state) {
  return {
    tracks:  state.tracks,
    playing: state.player.playing,
    waiting: state.player.waiting
  };
}

function mapDispatchToProps(dispatch, props) {
  if (props.selected) {
    return {
      onButtonClick: () => dispatch({ type: TOGGLE_PLAY })
    };
  } else {
    return {
      onButtonClick: (trackID) => dispatch({
        type:    SELECT_TRACK,
        payload: props.track.id
      })
    };
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Track);
