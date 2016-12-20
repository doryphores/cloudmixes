import SC from 'soundcloud';
import fs from 'fs-extra';
import path from 'path';

const USER_NAME = 'doryphores';
const CLIENT_ID = '7eff5005846f8ac6bd32d417a55eb5d5';

export default class SoundCloud {
  constructor() {
    SC.initialize({ client_id: CLIENT_ID });
  }

  fetchTracks() {
    return SC.resolve(`https://soundcloud.com/${USER_NAME}`).then(user => {
      return SC.get(`/users/${user.id}/followings`);
    }).then(users => {
      return Promise.all(users.collection.map(user => {
        return SC.get(`/users/${user.id}/tracks?duration[from]=${30*60*1000}`);
      }));
    }).then(tracks => {
      let allTracks = Array.prototype.concat.apply([], tracks).sort((a, b) => {
        if (a.created_at == b.created_at) return 0;
        return a.created_at < b.created_at ? 1 : -1;
      }).map(t => {
        return {
          id: t.id,
          created_at: t.created_at,
          duration: t.duration,
          title: t.title,
          permalink_url: t.permalink_url,
          artwork_url: t.artwork_url,
          waveform_url: t.waveform_url,
          stream_url: t.stream_url,
          username: t.user.username
        };
      });
      return Promise.resolve(allTracks);
    });
  }

  stream(track_id) {
    return SC.stream(`/tracks/${track_id}`);
  }
}
