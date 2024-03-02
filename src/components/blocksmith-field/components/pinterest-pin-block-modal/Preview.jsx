/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import noop from 'lodash/noop';

export default function Preview (props) {
  const { formState } = props;
  const { href, size, terse } = formState.values;
  const embedParentRef = useRef();

  useEffect(() => {
    if (!href) {
      return noop;
    }
    
    embed();
  }, [href, size, terse]);

  const clean = () => {
    Array.from(embedParentRef.current.children).forEach((child) => {
      embedParentRef.current.removeChild(child);
    });
  }

  const embed = () => {
    clean();

    const embedHtml = document.createElement('a');
    embedHtml.setAttribute('data-pin-do', 'embedPin');
    embedHtml.setAttribute('data-pin-width', size);
    embedHtml.href = href;
    if (terse) {
      embedHtml.setAttribute('data-pin-terse', 'true');
    }
    embedParentRef.current.appendChild(embedHtml);

    const embedScript = document.createElement('script');
    embedScript.defer = true;
    embedScript.async = true;
    embedScript.setAttribute('data-pin-build', 'parsePinBtns');
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