import React from 'react';
import ReactDOM from 'react-dom';

import SoundCloud from './services/soundcloud';

const sc = new SoundCloud();

export function start(container) {
  sc.fetchTracks().then(tracks => {
    ReactDOM.render(
      <ul>
        {tracks.map(t => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>,
      container
    );
  });
}
