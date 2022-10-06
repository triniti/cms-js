import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Button } from 'reactstrap';
import Icon from 'components/icon';
import artifactUrl from 'plugins/ovp/artifactUrl';
import VideoAssetButton from './VideoAssetButton';

export default function VideoAssetIcon({ asset }) {

  const [mediaPlayer, setMediaPlayer] = useState({
    height: '0px',
    url: '',
    volume: 1.0,
    width: '0px',
    isPlaying: false,
    currentlyPlayingAssetId: null
  });

  const playerRef = useRef(null);

  const handleMediaPlayerCommand = (command, asset, mediaType, dimensions = { width: 0, height: 0 }) => {
    playerRef.current.seekTo(0);
    let currentlyPlayingAssetId = null;
    let isPlaying = false;
    let currentDimensions = { width: 0, height: 0 };
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
      isPlaying,
      height: currentDimensions.height,
      mediaType: mediaType || null,
      url: asset ? artifactUrl(asset, 'video') : null,
      volume: mediaPlayer.volume,
      width: currentDimensions.width,
    });
  }

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
            <>
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
            </>
          )
        }
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
      <VideoAssetButton
            asset={asset}
            currentlyPlayingAssetId={mediaPlayer.currentlyPlayingAssetId}
            onPlayerCommand={handleMediaPlayerCommand}
          />
    </>
  );
}
