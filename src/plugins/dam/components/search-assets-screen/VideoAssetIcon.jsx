import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Button } from 'reactstrap';
import Icon from 'components/icon';
import artifactUrl from 'plugins/ovp/artifactUrl';

export default function VideoAssetIcon({ asset }) {
  const playerRef = useRef(null);

  const [mediaPlayer, setMediaPlayer] = useState({
    controls: false,
    currentlyPlayingAssetId: null,
    height: '0px',
    isPlaying: false,
    mediaType: null,
    url: '',
    volume: 1.0,
    width: '0px',
  });


  const handleMediaPlayerCommand = (command, asset, mediaType, dimensions = { width: 0, height: 0 }) => {
    playerRef.current?.seekTo(0);
    let currentlyPlayingAssetId = null;
    let currentDimensions = { width: 0, height: 0 };
    let isPlaying = false;
    let showControls = false;
    if (command === 'play') {
      currentlyPlayingAssetId = asset.get('_id');
      isPlaying = true;
      currentDimensions = dimensions;
      if (mediaType === 'video') {
        showControls = true;
      }
    }

    setMediaPlayer({
      controls: showControls,
      currentlyPlayingAssetId,
      height: currentDimensions.height,
      isPlaying,
      mediaType: mediaType || null,
      url: asset ? artifactUrl(asset, 'video') : null,
      volume: mediaPlayer.volume,
      width: currentDimensions.width,
    });
  }

  const playing = mediaPlayer.currentlyPlayingAssetId !== null && asset.get('_id').toString() === mediaPlayer.currentlyPlayingAssetId.toString();
  const buttonState = playing ? 'active' : '';
  const command = playing ? 'stop' : 'play';

  return (
    <>
      <div
        style={{
          zIndex: 1049,
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '100%',
          padding: '1rem',
          maxWidth: '800px',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {mediaPlayer.isPlaying && mediaPlayer.mediaType === 'video' && (
          <Icon
            id="dismiss-player"
            imgSrc="delete"
            alert
            onClick={() => handleMediaPlayerCommand('stop')}
            size="xs"
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '2px',
              top: '2px',
              zIndex: 1,
            }}
          />
        )}
        <ReactPlayer
          controls={mediaPlayer.controls}
          height={mediaPlayer.height}
          playing={mediaPlayer.isPlaying}
          ref={playerRef}
          url={mediaPlayer.url}
          volume={mediaPlayer.volume}
          width={mediaPlayer.width}
          className="embed-responsive embed-responsive-16by9"
          style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.4)' }}
        />
      </div>
      <Button
        radius="circle"
        size="sm"
        color="hover"
        id={`button.${asset.get('_id').toString()}`}
        onClick={() => handleMediaPlayerCommand(command, asset, 'video', { width: '100%', height: '100%' })}
        className={`mt-1 mb-0 ${buttonState}`}
      >
        <span className="m-0 icon-toggle icon icon-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-3-6V8a.5.5 0 0 1 .736-.44l6.67 3.942a.5.5 0 0 1 .041.857l-6.67 4.058A.5.5 0 0 1 9 16z" /></svg>
        </span>
        <span className="m-0 icon-toggle icon icon-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM7.5 7h2a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm7 0h2a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5z" /></svg>
        </span>
      </Button>
    </>
  );
}
