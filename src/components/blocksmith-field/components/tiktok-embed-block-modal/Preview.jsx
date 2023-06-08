import React, { useEffect, useRef } from 'react';

export default function Preview (props) {
  const embedParentRef = useRef(null);
  const { formState } = props;
  const { tiktok_id: tiktokId } = formState.values;

  useEffect(() => {
    embed();
  }, tiktokId);

  const clean = () => {
    Array.from(embedParentRef.current.children).forEach((child) => {
      embedParentRef.current.removeChild(child);
    });
  }

  const embed = () => {
    clean();
    const embedHtml = document.createElement('blockquote');
    embedHtml.classList.add('tiktok-embed');
    embedHtml.setAttribute('data-video-id', tiktokId);
    embedHtml.innerHTML = '<section></section>';
    const embedScript = document.createElement('script');
    embedScript.async = true;
    embedScript.src = 'https://www.tiktok.com/embed.js';
    embedParentRef.current.appendChild(embedHtml);
    embedParentRef.current.appendChild(embedScript);
  }

  return (
    <div ref={embedParentRef} />
  );
}