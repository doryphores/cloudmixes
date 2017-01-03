import { LOAD_TRACKS } from '../actions'

export function tracks (state = [], action) {
  switch (action.type) {
    case LOAD_TRACKS:
      return action.payload
    default:
      return state
  }
}
