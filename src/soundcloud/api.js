import SC from 'soundcloud'
import EventEmitter from 'events'
import { formatDuration } from '../utils'

export const EVENTS = {
  TRACK: {
    LOADED: 'TRACK_LOADED'
  },
  PLAYER: {
    TIME_CHANGED: 'PLAYER_TIME_CHANGED',
    STATE_CHANGED: 'PLAYER_STATE_CHANGED',
    TRACK_ENDED: 'PLAYER_TRACK_ENDED'
  }
}

export default class API extends EventEmitter {
  constructor (config) {
    super()
    SC.initialize(config)
  }

  fetchTracks (minTrackLength) {
    let minDuration = minTrackLength * 60 * 1000

    return SC.get('/me/activities/tracks/affiliated', {
      limit: 100
    }).then(({ collection }) => {
      console.log('BEFORE FILTER')
      let trackIDSet = new Set()

      let tracks = collection.filter(({ type, origin }) => {
        let isTrack = type.indexOf('track') === 0 && origin.duration > minDuration
        if (!isTrack) return false
        if (trackIDSet.has(origin.id)) return false
        trackIDSet.add(origin.id)
        return true
      })

      console.log('AFTER FILTER')

      console.log(tracks)

      tracks = tracks.map(({ origin }) => {
        console.log('Hello')
        return {
          id: origin.id,
          created_at: origin.created_at,
          duration: origin.duration,
          title: origin.title,
          permalink_url: origin.permalink_url,
          artwork_url: origin.artwork_url,
          waveform_url: origin.waveform_url,
          stream_url: origin.stream_url,
          username: origin.user.username
        }
      })

      console.log(tracks)

      return Promise.resolve(tracks)
    })
  }

  unloadTrack (trackID) {
    if (trackID && !this._trackIsLoaded(trackID)) return

    if (this.player) {
      this.player.dispose()
      delete this.player
    }
  }

  togglePlay (trackID, startFrom = 0) {
    if (this._trackIsLoaded(trackID)) {
      this.player.toggle()
      return
    }

    this._loadTrack(trackID).then(() => {
      this.emit(EVENTS.TRACK.LOADED, trackID)

      if (startFrom > 0) {
        console.info('Starting playback from %s', formatDuration(startFrom))

        this.player.once('play-resume', () => {
          this.player.seek(startFrom)

          this.player.once('play-resume', () => this._listenToPlayerEvents())
        })
      } else {
        this._listenToPlayerEvents()
      }

      this.player.play()
    })
  }

  seek (time) {
    if (this.player) {
      this.player.seek(time)
    } else {
      // The player isn't loaded so acknowledge the time change immediately,
      // this allows the UI to show the current selected time
      this.emit(EVENTS.PLAYER.TIME_CHANGED, time)
    }
  }

  _loadTrack (trackID) {
    console.info('Loading stream')

    this.unloadTrack()

    return SC.stream(`/tracks/${trackID}`).then(player => {
      this.player = player

      console.info('Stream loaded')
    })
  }

  _trackIsLoaded (trackID) {
    return !!(this.player && this.player.getId() === trackID)
  }

  _listenToPlayerEvents () {
    this.player.on('time', () => {
      this.emit(EVENTS.PLAYER.TIME_CHANGED, this.player.currentTime())
    })

    this.player.on('state-change', state => {
      this.emit(EVENTS.PLAYER.STATE_CHANGED, {
        playing: this.player.isLoading() || this.player.isPlaying(),
        waiting: this.player.isLoading() || this.player.isBuffering(),
        seeking: state === 'seeking'
      })
    })

    this.player.on('finish', () => {
      this.player.seek(0)
      this.emit(EVENTS.PLAYER.TRACK_ENDED)
    })
  }
}
