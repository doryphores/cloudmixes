import React from 'react';
import moment from 'moment';

const Track = ({ track }) => (
  <div className="track-list__item track u-flex u-flex--horizontal">
    <div className="track__artwork u-flex__panel">
      <img src={track.artwork_url} />
    </div>
    <div className="track__meta u-flex__panel u-flex__panel--grow">
      <span className="track__meta-item track__title">{track.title}</span>
      <span className="track__meta-item track__duration">
        {displayDuration(track.duration)}
      </span>
      <span className="track__meta-item track__artist">{track.username}</span>
    </div>
  </div>
);

function displayDuration(duration) {
  return moment.duration(duration).humanize();
}

export default Track;
