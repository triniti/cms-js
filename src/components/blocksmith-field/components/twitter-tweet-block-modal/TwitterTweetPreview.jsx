import React, { useEffect, useRef } from 'react';

const loadTwitterSDK = () => {
  /* eslint-disable */
  window.twttr = (function(d, s, id) {
    let js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };

    return t;
  }(document, "script", "twitter-wjs"));
  /* eslint-enable */
};

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