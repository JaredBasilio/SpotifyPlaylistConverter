import React from 'react';
import logo from './youtube.png';
import spotifyDefault from './spotify_default.png'

export default function PlaylistSongs({ track }) {
    return (
    <>
      <div className="d-flex justify-content-sm-between align-items-center">
        <div className="d-flex align-items-center">
          <img src={track.albumUrl} alt={spotifyDefault} style={{ height: "64px", width: "64px" }} />
          <div className="m-1">
            <div>{track.title}</div>
            <div className="text-muted">{track.artist}</div>
          </div>
        </div>
        <img src={logo} alt={""} style={{ height: "25px", width: "auto", float: "right"}}/>
      </div>
    </>
  )
}