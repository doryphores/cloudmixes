import React from 'react';
import classnames from 'classnames';

import { formatDuration } from '../utils';

const Track = ({ track, active, playing, onSelect }) => (
  <div className={trackClassNames(active, playing)}>
    <div className="track__button  u-flex__panel"
      onClick={() => onSelect(track.id)}>
      <span className="track__artwork" style={artworkStyles(track.artwork_url)} />
      <i className="material-icons md-24 track__button-icon">
        {playing ? 'pause' : 'play_arrow'}
      </i>
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

function trackClassNames(active, playing) {
  return classnames('track-list__item track u-flex u-flex--horizontal', {
    'track--active': active,
    'track--playing': playing
  });
}

function artworkStyles(artworkURL) {
  return artworkURL ? { backgroundImage: `url(${artworkURL})` } : {};
}

export default Track;
