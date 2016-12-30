import SC from "soundcloud";
import EventEmitter from "events";
import { formatDuration } from "../utils";

const CLIENT_ID = "7eff5005846f8ac6bd32d417a55eb5d5";

export const EVENTS = {
  TRACK: {
    LOADED:   "TRACK_LOADED"
  },
  PLAYER: {
    TIME_CHANGED:  "PLAYER_TIME_CHANGED",
    STATE_CHANGED: "PLAYER_STATE_CHANGED"
  }
};

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
          id:            t.id,
          created_at:    t.created_at,
          duration:      t.duration,
          title:         t.title,
          permalink_url: t.permalink_url,
          artwork_url:   t.artwork_url,
          waveform_url:  t.waveform_url,
          stream_url:    t.stream_url,
          username:      t.user.username
        };
      });

      return Promise.resolve(allTracks);
    });
  }

  unloadTrack(trackID) {
    if (trackID && !this._trackIsLoaded(trackID)) return;

    if (this.player) {
      this.player.dispose();
      delete this.player;
    }
  }

  togglePlay(trackID, startFrom = 0) {
    if (this._trackIsLoaded(trackID)) {
      this.player.toggle();
      return;
    }

    this._loadTrack(trackID).then(() => {
      this.emit(EVENTS.TRACK.LOADED, trackID);

      if (startFrom > 0) {
        console.info("Starting playback from %s", formatDuration(startFrom));

        this.player.once("play-resume", () => {
          this.player.seek(startFrom);

          this.player.once("play-resume", () => this._listenToPlayerEvents());
        });
      } else {
        this._listenToPlayerEvents();
      }

      this.player.play();
    });
  }

  seek(time) {
    if (this.player) {
      this.player.seek(time);
    } else {
      // The player isn't loaded so acknowledge the time change immediately,
      // this allows the UI to show the current selected time
      this.emit(EVENTS.PLAYER.TIME_CHANGED, time);
    }
  }

  _loadTrack(trackID) {
    console.info("Loading stream");

    this.unloadTrack();

    return SC.stream(`/tracks/${trackID}`).then(player => {
      this.player = player;

      console.info("Stream loaded");
    });
  }

  _trackIsLoaded(trackID) {
    return !!(this.player && this.player.getId() === trackID);
  }

  _listenToPlayerEvents() {
    this.player.on("time", () => {
      this.emit(EVENTS.PLAYER.TIME_CHANGED, this.player.currentTime());
    });

    this.player.on("state-change", state => {
      this.emit(EVENTS.PLAYER.STATE_CHANGED, {
        playing: this.player.isLoading() || this.player.isPlaying(),
        waiting: this.player.isLoading() || this.player.isBuffering(),
        seeking: state == "seeking"
      });
    });

    this.player.on("finish", () => this.player.seek(0));
  }
}
