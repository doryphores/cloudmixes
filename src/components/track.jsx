import React from 'react';

import { formatDuration } from '../utils';

const Track = ({ track, onSelect }) => (
  <div className="track-list__item track u-flex u-flex--horizontal">
    <div className="track__button  u-flex__panel"
      onClick={() => onSelect(track.id)}>
      <img className="track__artwork" src={track.artwork_url} />
      <i className="material-icons md-24 track__button-icon">play_arrow</i>
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

export default Track;
