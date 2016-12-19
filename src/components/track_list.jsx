import React from 'react';

import Track from './track';

const TrackList = ({ tracks }) => (
  <div>
    {tracks.map(track => (
      <Track key={track.id} track={track} />
    ))}
  </div>
);

export default TrackList;
