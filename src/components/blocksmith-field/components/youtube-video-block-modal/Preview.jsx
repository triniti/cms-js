import React, { useState } from 'react';
import YouTube from 'react-youtube';
import classNames from 'classnames';
import { Media } from 'reactstrap';
import { BackgroundImage } from 'components';
import damUrl from 'plugins/dam/damUrl';
import './Preview.scss';

export default function Preview(props) {
  const { formState, width = 510, className, imageNode } = props;
  const { autoplay, start_at: startAt, id, poster_image_ref: posterImageRef } = formState.values;

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [player, setPlayer] = useState(null);

  const handleOnReady = (event) => {
    const player = event.target;
    setIsPlayerReady(true);
    setPlayer(player);
  }

  const shouldAutoPlay = (imageNode && showVideo) || autoplay;

  if (player) {
    if (shouldAutoPlay) {
      player.seekTo(startAt);
      // check if player is in "PAUSED" state ( https://developers.google.com/youtube/iframe_api_reference )
      if (player.getPlayerState() === 2) {
        player.playVideo();
      }
    } else {
      player.cueVideoById(id, startAt);
    }
  }

  return (
    <div
      className={classNames('block-preview-youtube-video', className)}
      role="presentation"
    >
      {
        posterImageRef && !showVideo && isPlayerReady && (
          <Media
            onClick={() => setShowVideo(true)}
            className="ratio ratio-16x9 poster"
            style={{
              width: `${width}px`,
            }}
          >
            <BackgroundImage
              imgSrc={`${damUrl(posterImageRef)}`}
              alt="video-thumbnail"
            />
          </Media>
        )
      }
      <YouTube
        videoId={id}
        onReady={handleOnReady}
        opts={{
          height: width / (16 / 9),
          width,
          playerVars: {
            autoplay,
          },
        }}
      />
    </div>
  );
}