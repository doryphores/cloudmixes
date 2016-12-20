import SC from 'soundcloud';
import fs from 'fs-extra';
import path from 'path';

const USER_NAME = 'doryphores';
const CLIENT_ID = '7eff5005846f8ac6bd32d417a55eb5d5';

const CACHE_PATH = path.join(
  require('electron').remote.app.getPath('userData'),
  'cache'
);

export default class SoundCloud {
  constructor() {
    SC.initialize({ client_id: CLIENT_ID });
  }

  fetchTracks() {
    return this.fetchTracksFromCache().catch((err) => {
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
        });
        this.cacheTracks(allTracks);
        return Promise.resolve(allTracks);
      });
    });
  }

  stream(track_id) {
    return SC.stream(`/tracks/${track_id}`);
  }

  cacheTracks(tracks) {
    fs.outputJSON(path.join(CACHE_PATH, 'tracks.json'), tracks, (err) => {
      console.error(err);
    });
  }

  fetchTracksFromCache(refresh = false) {
    if (refresh) return Promise.reject();
    return new Promise((resolve, reject) => {
      fs.readJSON(path.join(CACHE_PATH, 'tracks.json'), (err, tracks) => {
        if (err) reject(err);
        resolve(tracks);
      });
    })
  }
}
