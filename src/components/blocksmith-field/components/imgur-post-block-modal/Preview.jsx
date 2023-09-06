import React, { useEffect, useRef } from 'react';

export default function Preview (props) {
  const embedParentRef = useRef();
  const { formState } = props;
  const { id, show_context: showContext } = formState.values;

  useEffect(() => {
    embed();
  }, [id, showContext]);

  const clean = () => embedParentRef.current.replaceChilden();

  const embed = () => {
    clean();

    const embedHtml = document.createElement('blockquote');
    embedHtml.classList.add('imgur-embed-pub');
    embedHtml.setAttribute('data-id', id);
    embedHtml.setAttribute('lang', 'en');
    embedHtml.setAttribute('data-context', showContext ? `${showContext}` : '');
    embedParentRef.current.appendChild(embedHtml);

    const embedScript = document.createElement('script');
    embedScript.async = true;
    embedScript.src = 'https://s.imgur.com/min/embed.js';
    embedScript.setAttribute('charset', 'utf-8');
    embedParentRef.current.appendChild(embedScript);
  }

  return (
    <div ref={embedParentRef} />
  );
}