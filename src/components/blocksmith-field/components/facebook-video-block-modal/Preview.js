import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Media } from 'reactstrap';
import { BackgroundImage } from 'components';
import damUrl from 'plugins/dam/damUrl';
import loadFacebookSDK from '@triniti/cms/components/blocksmith-field/utils/loadFacebookSDK';
import './Preview.scss';

export default function Preview(props) {
  const fbVideo = useRef();
  const { formState, width } = props;
  const { href, poster_image_ref: posterImageRef, show_captions: showCaptions, show_text: showText, } = formState.values;
  const [ showVideo, setShowVideo ] = useState(false);
  const autoplay = (posterImageRef && showVideo) || autoplay;

  useEffect(() => {
    loadFacebookSDK();
  }, [href]);

  setTimeout(() => {
    if (window.FB && fbVideo.current) {
      window.FB.XFBML.parse(fbVideo.current.parentNode);
    }
  }, 0);

  const height = width / (16 / 9);

  return (
    <div
      className={classNames('block-preview-facebook-video')}
      role="presentation"
    >
      {
        posterImageRef && !showVideo && (
          <Media
            onClick={() => setShowVideo(true)}
            className="poster ratio ratio-16x9"
            style={{
              cursor: 'pointer',
              width: `${width}px`,
            }}
          >
            <BackgroundImage
              imgSrc={`${damUrl(posterImageRef, '16by9', 'md')}`}
              alt="video-thumbnail"
            />
          </Media>
        )
      }
      <div
        className="fb-video"
        data-href={href}
        data-autoplay={autoplay}
        data-show-captions={showCaptions}
        data-show-text={showText}
        ref={fbVideo}
        style={{
          minHeight: `${height}px`,
        }}
      />
    </div>
  );
}
