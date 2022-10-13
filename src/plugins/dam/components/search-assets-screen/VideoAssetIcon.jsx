import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Button } from 'reactstrap';
import Icon from 'components/icon';
import artifactUrl from 'plugins/ovp/artifactUrl';

export default function VideoAssetIcon({ asset }) {
  const playerRef = useRef(null);

  const [controls, setControls] = useState(false);
  const [currentlyPlayingAssetId, setCurrentlyPlayingAssetId] = useState(null);
  const [height, setHeight] = useState('0px');
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState('');
  const [mediaType, setMediaType] = useState(null);
  const [volume, setVolume] = useState(1.0);
  const [width, setWidth] = useState('0px');


  const handleMediaPlayerCommand = (command, asset, mediaType, dimensions = { width: 0, height: 0 }) => {
    playerRef.current.seekTo(0);

    if (command === 'play') {
      setControls(true);
      setCurrentlyPlayingAssetId(asset.get('_id'));
      setIsPlaying(true);
      setWidth(dimensions.width);
      setHeight(dimensions.height);
      setUrl(asset ? artifactUrl(asset, 'video') : null);
      setMediaType(mediaType || null);
    } else {
      setCurrentlyPlayingAssetId(null);
      setIsPlaying(false);
      setWidth('0px');
      setHeight('0px');
    }
  }


  const playing = currentlyPlayingAssetId !== null && asset.get('_id').toString() === currentlyPlayingAssetId.toString();
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
        {isPlaying && mediaType === 'video' && (
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
          controls={controls}
          height={height}
          playing={isPlaying}
          ref={playerRef}
          url={url}
          volume={volume}
          width={width}
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
