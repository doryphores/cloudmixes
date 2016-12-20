import React from 'react';
import classnames from 'classnames';

import Track from './track';

const TrackList = ({ tracks, className }) => (
  <div className={classnames("track-list", className)}>
    {tracks.map(track => (
      <Track key={track.id} track={track} />
    ))}
  </div>
);

export default TrackList;
