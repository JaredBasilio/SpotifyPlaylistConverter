import React from 'react';

export default function TrackSearchResult({playlist, choosePlaylist}) {
    function handleClick() {
        choosePlaylist(playlist);
    }

    return (
        <div className="d-flex m-2 align-items-center" 
            style={{cursor: "pointer"}}
            onClick={handleClick}
        >
            <img src={playlist.albumUrl} alt={""} style={{height: '64px', width: "64px"}} />
            <div className="m-1">
                <div>{playlist.title}</div>
                <div className="text-muted">{playlist.owner}</div>
            </div>
        </div>
    )
}