import React, { useEffect, useRef } from 'react';
import loadTwitterSDK from 'components/blocksmith-field/utils/loadTwitterSDK';

export default function TwitterTweetPreview ({ hideMedia, hideThread, tweetId }) {
  
  useEffect(() => loadTwitterSDK());
  const twitterPreview = useRef();

  setTimeout(() => {
    // if you don't wipe out the contents of the preview div it will just keep appending them
    twitterPreview.current.innerHTML = '';
    if (window.twttr) {
      window.twttr.ready((twttr) => {
        twttr.widgets.createTweet(
          tweetId,
          twitterPreview.current,
          {
            cards: hideMedia ? 'hidden' : '',
            conversation: hideThread ? 'none' : '',
          },
        );
      });
    }
  }, 0);

  return (
    <div ref={(ref) => { twitterPreview.current = ref; }} />
  );
}