import React, { useEffect, useRef } from 'react';

const loadFacebookSDK = () => {
  if (!document.getElementById('fb-root')) {
    const body = document.body.firstChild;
    const fbRoot = document.createElement('div');
    fbRoot.setAttribute('id', 'fb-root');
    body.parentNode.insertBefore(fbRoot, body);
  }

  /* eslint-disable */
  (function(d, s, id) {
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  /* eslint-enable */
};

export default function FacebookPostBlockPreview ({ formState }) {
  
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