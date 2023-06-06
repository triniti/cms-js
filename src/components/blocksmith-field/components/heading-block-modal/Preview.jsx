import React from 'react';
import classNames from 'classnames';

export default function Preview(/*{ className, block }*/ props) {
  const { formState } = props;
  const { size, text, url } = formState.values;
  const CustomTag = `h${size || 1}`;

  return (
    <div className={classNames('heading-preview', 'pt-4')}>
      {!url && <CustomTag>{text}</CustomTag>}
      {url && (
        <a className="url" href={url} rel="noopener noreferrer" target="_blank">
          <CustomTag>{text}</CustomTag>
        </a>
      )}
    </div>
  );
}
