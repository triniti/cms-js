import React, { useEffect, useRef } from 'react';

const loadInstagramSDK = (embedParentRef) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.instagram.com/embed.js';
  script.onload = () => {
    window.instgrm.Embeds.process();
  };
  embedParentRef.current.appendChild(script);
}

export default function InstagramMediaBlockPreview({ formState }) {
  const { hidecaption, id } = formState.values;

  const embedParentRef = useRef();
  useEffect(() => {
    loadInstagramSDK(embedParentRef);
    embed();
  }, [id, hidecaption]);

  const clean = () => {
    Array.from(embedParentRef.current.children).forEach((child) => {
      embedParentRef.current.removeChild(child);
    });
  }

  const embed = () => {
    clean();
    const instagramBlock = document.createElement('blockquote');
    instagramBlock.className = 'instagram-media';
    if (!hidecaption) {
      instagramBlock.setAttribute('data-instgrm-captioned', '');
    }
    instagramBlock.setAttribute('data-instgrm-permalink', `https://www.instagram.com/p/${id}/`);
    embedParentRef.current.appendChild(instagramBlock);
  }
  
  return (
    <div id="instagram-preview">
      <header className="instagram-preview__header">
        Link to post:&nbsp;
        <a
          href={`https://www.instagram.com/p/${id}/`}
          target="_blank"
          className="instagram-preview__link"
          rel="noopener noreferrer"
        >
          {`https://www.instagram.com/p/${id}/`}
        </a>
      </header>
      <div ref={embedParentRef} className="instagram-preview__iframe" />
    </div>
  );
};
