import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import TrackSearchResult from './TrackSearchResult'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import PlaylistSongs from './PlaylistSongs'
import YoutubeEquivalent from './getYoutubeEquivalent.js'

const spotifyApi = new SpotifyWebApi({
    clientId: "08156139e78547f08fdf63867fdfb976",
})

export default function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [currPlaylist, setPlaylist] = useState("")
    const [songs, setSongs] = useState([])

    function choosePlaylist(playlist) {
      setPlaylist(playlist)
    }

    //allows access to spotifyAPI
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    //returns the info of a given searchresult
    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return
    
        let cancel = false
        spotifyApi.searchPlaylists(search)
          .then(data => {
            if (cancel) 
                return
            setSearchResults(
              data.body.playlists.items.map(playlist => {
                const smallestAlbumImage = playlist.images.reduce(
                  (smallest, image) => {
                    if (image.height < smallest.height) return image
                    return smallest
                  },
                  playlist.images[0]
                )
                return {
                  title: playlist.name,
                  uri: playlist.uri,
                  albumUrl: smallestAlbumImage.url,
                  owner: playlist.owner.display_name
                }
              })
            )
          }).catch(TypeError => {
            return
          })
        return () => (cancel = true)
    }, [search, accessToken])

    //checks for a selected playlist
    useEffect(() => {
      if (!currPlaylist) return setPlaylist("")

      let cancel = false
      spotifyApi.getPlaylist(currPlaylist.uri.substring(17))
        .then(data => {
          if (cancel) 
                return
          setSongs(

            data.body.tracks.items.filter((song) => {
              if (song === null || song.track === null || song === undefined) {
                return false;
              }
              return true;
            }).map((song) => {
              if (song === null || song.track === null || song === undefined) {
                return
              }
              var artist = "";
              for (let i = 0;i < song.track.artists.length;i++) {
                if (i === song.track.artists.length - 1) {
                  artist += JSON.parse(JSON.stringify(song.track.artists[i].name));
                } else {
                  artist += JSON.parse(JSON.stringify(song.track.artists[i].name));
                  artist += ', ';
                }
              }
              YoutubeEquivalent(song.track.name);
              if (song.is_local || song.track === undefined) {
                return {
                  title: song.track.name,
                  albumUrl: "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999", //the "no album" cover image
                  artist: artist,
                }
              }
              const smallestAlbumImage = song.track.album.images.reduce(
                (smallest, image) => {
                  if (image.height < smallest.height) return image
                  return smallest
                },
                song.track.album.images[0]
              )
              return {
                title: song.track.name,
                albumUrl: smallestAlbumImage.url,
                artist: artist,
              }
          }))
        })
      return () => (cancel = true)
    }, [currPlaylist])

    return (
        <>
          <Container className="d-flex flex-column py-2" style={{
          height: "100vh", width: "35vh", display:"flex", float: "left"}}>
              <Form.Control
                  type="search"
                  placeholder="Search for Playlist"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
              />
              <div className="flex-grow-1 my-2" style={{ overflowY: "auto"}}>
                  {searchResults.map(playlist => (
                    <TrackSearchResult 
                      playlist={playlist} 
                      key={playlist.uri} 
                      choosePlaylist = {choosePlaylist}
                    />
                  ))}
              </div>
          </Container>
          <Container>
            <h3>
              {currPlaylist.title}
            </h3>
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto"}}>
                {songs.map(track => (
                  <PlaylistSongs
                    track = { track }
                  />
                ))}
            </div>
          </Container>
        </>
    )
}