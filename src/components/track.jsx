import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import PlayButton from './play_button';
import { formatDuration } from '../utils';
import { SELECT_TRACK, TOGGLE_PLAY, BLACKLIST_TRACK } from '../actions';

const Track = ({ track, selected, playing, waiting, onButtonClick, onRemoveClick }) => (
  <div className={trackClassNames(selected)}>
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
      <div className="u-flex u-flex--horizontal">
        <div className="u-flex__panel u-flex__panel--grow track__title">
          {track.title}
        </div>
        <div className="u-flex__panel">
          <span className="track__action material-icons md-18"
            onClick={onRemoveClick}>
            remove_circle
          </span>
        </div>
      </div>
      <div className="u-flex u-flex--horizontal">
        <div className="u-flex__panel u-flex__panel--grow track__artist">
          {track.username}
        </div>
        <div className="u-flex__panel track__duration">
          {formatDuration(track.duration)}
        </div>
      </div>
    </div>
  </div>
);

function trackClassNames(selected) {
  return classnames('track-list__item track u-flex u-flex--horizontal', {
    'track--selected': selected
  });
}

function artworkStyles(artworkURL) {
  return artworkURL ? { backgroundImage: `url(${artworkURL})` } : {};
}

function mapStateToProps(state) {
  return {
    playing: state.player.playing,
    waiting: state.player.waiting
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    onRemoveClick: () => dispatch({
      type:    BLACKLIST_TRACK,
      payload: props.track.id
    }),
    onButtonClick: (trackID) => dispatch({
      type:    props.selected ? TOGGLE_PLAY : SELECT_TRACK,
      payload: props.track.id
    })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Track);
