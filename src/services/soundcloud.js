import SC from "soundcloud";

const USER_NAME = "doryphores";
const CLIENT_ID = "7eff5005846f8ac6bd32d417a55eb5d5";

SC.initialize({
  client_id: CLIENT_ID
});

export default class SoundCloud {
  fetchTracks() {
    return SC.resolve(`https://soundcloud.com/${USER_NAME}`).then(user => {
      return SC.get(`/users/${user.id}/followings`)
    }).then(users => {
      return Promise.all(users.collection.map(user => {
        return SC.get(`/users/${user.id}/tracks`)
      }))
    }).then(tracks => {
      let allTracks = Array.prototype.concat.apply([], tracks).sort((a, b) => {
        if (a.created_at == b.created_at) return 0;
        return a.created_at < b.created_at ? 1 : -1;
      });
      return Promise.resolve(allTracks);
    })
  }

  stream(track_id) {
    return SC.stream(`/tracks/${track_id}`)
  }
}
