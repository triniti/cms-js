import React from 'react';
import classNames from 'classnames';
import 'components/blocksmith-field/components/heading-block-preview/styles.scss';

// todo: get rid of custom styles, ideally we're using the bootstrap styles

export default function HeadingBlockPreview({ className, block }) {
  const CustomTag = `h${block.get('size', 1)}`;
  return (
    <div className={classNames('heading-preview', 'px-4', className)}>
      {!block.has('url') && <CustomTag>{block.get('text')}</CustomTag>}
      {block.has('url') && (
        <a className="url" href={block.get('url')} rel="noopener noreferrer" target="_blank">
          <CustomTag>{block.get('text')}</CustomTag>
        </a>
      )}
    </div>
  );
}
