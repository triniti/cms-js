/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Preview (props) {
  const { formState } = props;
  const { href, size, terse } = formState.values;
  const embedParentRef = useRef();

  console.log('Debug everything', {
    href, size, terse
  });

  useEffect(() => {
    embed();
  }, [href, size, terse]);

  const clean = () => {
    Array.from(embedParentRef.current.children).forEach((child) => {
      embedParentRef.current.removeChild(child);
    });
  }

  const embed = async () => {
    clean();

    const embedHtml = document.createElement('a');
    embedHtml.setAttribute('data-pin-do', 'embedPin');
    embedHtml.setAttribute('data-pin-width', size);
    embedHtml.href = href;
    if (terse) {
      embedHtml.setAttribute('data-pin-terse', 'true');
    }
    embedParentRef.current.appendChild(embedHtml);

    await timeout(1000); // need some delay before loading script

    const embedScript = document.createElement('script');
    embedScript.defer = true;
    embedScript.async = true;
    embedScript.setAttribute('data-pin-build', 'embedPin');
    embedScript.src = 'https://assets.pinterest.com/js/pinit.js';
    embedParentRef.current.appendChild(embedScript);

    if (window.parsePinBtns) {
      window.parsePinBtns();
    }
  }

  return (
    <div className="d-flex justify-content-center" ref={embedParentRef} />
  );
}