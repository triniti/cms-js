import React, { useEffect, useRef } from 'react';
import loadFacebookSDK from '@triniti/cms/components/blocksmith-field/utils/loadFacebookSDK.js';

export default function Preview ({ formState }) {

  const { href, show_text: showText, width } = formState.values;
  const fbPost = useRef();

  useEffect(() => {
    loadFacebookSDK();
  }, [href]);

  setTimeout(() => {
    if (window.FB) {
      window.FB.XFBML.parse(fbPost.current.parentNode);
    }
  }, 0);

  return (
    <div
      className="fb-post"
      data-href={href}
      data-show-text={showText || true}
      data-width={width}
      ref={fbPost}
    />
  );
}
