import React, { useState } from 'react';
import classNames from 'classnames';
import { Media } from 'reactstrap';
import { BackgroundImage } from '@triniti/cms/components/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import '@triniti/cms/components/blocksmith-field/components/vimeo-video-block-modal/Preview.scss';

export default function VimeoVideoBlockPreview(props) {
  const { className, formState, width = 510 } = props;
  const { autoplay, description, id, loop, poster_image_ref: posterImageRef, show_title: showTitle, show_byline: showByline, show_portrait: showPortrait, title, user_id: userId, user_name: userName } = formState.values;
  const [ showVideo, setShowVideo ] = useState(false);

  const shouldAutoplay = (posterImageRef && showVideo) || autoplay;

  return (
    <div
      className={classNames('block-preview-video block-preview-vimeo-video', className)}
      role="presentation"
    >
      {
        posterImageRef && !showVideo && (
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
      {
        (!posterImageRef || showVideo) && (
          <iframe
            frameBorder="0"
            title="vimeo-video-block-preview"
            width={width}
            height={width / (16 / 9)}
            src={`https://player.vimeo.com/video/${id}?autoplay=${shouldAutoplay}&loop=${loop}&title=${showTitle}&byline=${showByline}&portrait=${showPortrait}`}
            allowFullScreen
          />
        )
      }
      {
        title && userName && userId
        && (
          <p>
            <a
              href={`https://vimeo.com/${id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
            </a>
            &nbsp;from&nbsp;
            <a
              href={`https://vimeo.com/${userId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {userName}
            </a>
            &nbsp;on&nbsp;
            <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer">Vimeo</a>
            .
          </p>
        )
      }
      {
        description
        && <p>{description}</p>
      }
    </div>
  );
}
