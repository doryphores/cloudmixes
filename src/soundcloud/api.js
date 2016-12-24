import SC from 'soundcloud';
import EventEmitter from 'events';
import { formatDuration } from '../utils';

const CLIENT_ID = '7eff5005846f8ac6bd32d417a55eb5d5';

export default class API extends EventEmitter {
  constructor() {
    super();
    SC.initialize({ client_id: CLIENT_ID });
  }

  fetchTracks(username, minTrackLength) {
    return SC.resolve(`https://soundcloud.com/${username}`).then(user => {
      return SC.get(`/users/${user.id}/followings`);
    }).then(users => {
      return Promise.all(users.collection.map(user => {
        return SC.get(`/users/${user.id}/tracks?duration[from]=${minTrackLength*60*1000}`);
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
    }).catch(err => Promise.reject(err));
  }

  loadTrack(trackID, resumeFrom = 0) {
    console.log("Loading stream and resuming play from %s", formatDuration(resumeFrom));
    return SC.stream(`/tracks/${trackID}`).then(player => {
      if (this.player) this.player.dispose();

      this.player = player;

      player.on('time', () => this.emit('time', player.currentTime()));
      player.on('state-change', (state) => {
        this.emit('state-change', {
          playing: state == 'loading' || player.isPlaying(),
          waiting: state == 'loading' || player.isBuffering(),
          seeking: state == 'seeking'
        });
      });

      if (resumeFrom > 0) {
        this.player.once('play-resume', () => this.player.seek(resumeFrom));
      }

      this.player.play();

      return Promise.resolve();
    }).catch(err => Promise.reject(err));
  }

  play(trackID, resumeFrom) {
    if (this.player) {
      console.log("Resuming playback");
      this.player.play();
    } else this.loadTrack(trackID, resumeFrom);
  }

  pause() {
    console.log("Pausing playback");
    this.player.pause();
  }

  seek(time) {
    if (this.player) this.player.seek(time);
  }
}
