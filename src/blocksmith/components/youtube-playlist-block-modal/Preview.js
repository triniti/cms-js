import React, { useState, useRef, useEffect } from 'react';
import { Media } from 'reactstrap';
import { BackgroundImage } from '@triniti/cms/components/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import noop from 'lodash-es/noop.js';
import '@triniti/cms/blocksmith/components/youtube-playlist-block-modal/Preview.scss';

const EMBED_ROOT_ID = 'youtube-playlist-block-embed-root';

export default (props) => {
  const { formState, width = 510 } = props;
  const { autoplay, video_id: videoId, playlist_id: playlistId, poster_image_ref: posterImageRef } = formState.values;
  const [ showVideo, setShowVideo ] = useState(!!posterImageRef !== false);
  const embedParentRef = useRef(null);
  const youtubeScript = useRef(null);
  const originalOnYouTubeIframeAPIReady = useRef(null);
  const player = useRef(null);

  useEffect(() => {
    if (window.YT) {
      create();
      return noop;
    }

    youtubeScript.current = document.createElement('script');
    youtubeScript.current.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(youtubeScript.current, firstScriptTag);

    originalOnYouTubeIframeAPIReady.current = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = create;
  });

  // componentDidUpdate(prevProps) {
  //   const { block } = this.props;
  //   if (
  //     block.has('poster_image_ref')
  //     && (
  //       !prevProps.block.has('poster_image_ref')
  //       || prevProps.block.get('video_id') !== block.get('video_id')
  //       || prevProps.block.get('playlist_id') !== block.get('playlist_id')
  //     )
  //   ) {
  //     this.setState(() => ({ showVideo: false }));
  //   } else if (!prevProps.block.get('autoplay') && block.get('autoplay')) {
  //     this.handlePlay();
  //   }
  // }

  // componentWillUnmount() {
  //   if (this.youtubeScript) {
  //     this.youtubeScript.parentNode.removeChild(this.youtubeScript);
  //   }
  //   window.onYouTubeIframeAPIReady = this.originalOnYouTubeIframeAPIReady;
  //   if (this.player) {
  //     this.player.destroy();
  //   }
  //   Array.from(this.embedParentRef.current.children).forEach((child) => {
  //     this.embedParentRef.current.removeChild(child);
  //   });
  // }

  const create = () => {
    const embedRoot = document.createElement('div');
    embedRoot.setAttribute('id', EMBED_ROOT_ID);
    embedParentRef.current.appendChild(embedRoot);
    player.current = new window.YT.Player(EMBED_ROOT_ID, {
      height: width / (16 / 9),
      width,
      events: {
        onReady: handleCue,
      },
    });
  }

  const handleCue = () => {
    if (!player.current || !showVideo) {
      return;
    }

    if (videoId) {
      player.current.cueVideoById({ videoId });
    } else if (typeof player.current.cuePlaylist === 'function') {
      player.current.cuePlaylist({ list: playlistId });
    }

    if (autoplay) {
      handlePlay();
    }
  }

  const handlePlay = () => {
    if (!videoId) {
      player.current.nextVideo();
      return;
    }

    player.current.seekTo(0);
    // check if player is in "PAUSED" state ( https://developers.google.com/youtube/iframe_api_reference )
    if (player.current.getPlayerState() === 2) {
      player.current.playVideo();
    }
  }

  handleCue();
  console.log('Poster image ref: ', posterImageRef);

  return (
    <div
      className="block-preview-video block-preview-youtube-playlist"
      role="presentation"
    >
      {posterImageRef && !showVideo && (
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
      )}
      <div ref={embedParentRef} />
    </div>
  );
}
