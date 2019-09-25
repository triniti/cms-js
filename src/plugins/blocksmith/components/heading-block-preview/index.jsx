import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import './styles.scss';

const HeadingBlockPreview = ({ className, block }) => (
  <div className={classNames('heading-preview', 'px-4', className)} role="presentation">
    {(() => {
      switch (block.get('size')) {
        case 1:
          return !block.get('url') ? <h1>{block.get('text')}</h1>
            : (
              <a
                className="url"
                href={block.get('url')}
                rel="noopener noreferrer"
                target="_blank"
              >
                <h1>{block.get('text')}</h1>
              </a>
            );
        case 2:
          return !block.get('url') ? <h2>{block.get('text')}</h2>
            : (
              <a
                className="url"
                href={block.get('url')}
                rel="noopener noreferrer"
                target="_blank"
              >
                <h2>{block.get('text')}</h2>
              </a>
            );
        case 3:
          return !block.get('url') ? <h3>{block.get('text')}</h3>
            : (
              <a
                className="url"
                href={block.get('url')}
                rel="noopener noreferrer"
                target="_blank"
              >
                <h3>{block.get('text')}</h3>
              </a>
            );
        case 4:
          return !block.get('url') ? <h4>{block.get('text')}</h4>
            : (
              <a
                className="url"
                href={block.get('url')}
                rel="noopener noreferrer"
                target="_blank"
              >
                <h4>{block.get('text')}</h4>
              </a>
            );
        case 5:
          return !block.get('url') ? <h5>{block.get('text')}</h5>
            : (
              <a
                className="url"
                href={block.get('url')}
                rel="noopener noreferrer"
                target="_blank"
              >
                <h5>{block.get('text')}</h5>
              </a>
            );
        case 6:
          return !block.get('url') ? <h6>{block.get('text')}</h6>
            : (
              <a
                className="url"
                href={block.get('url')}
                rel="noopener noreferrer"
                target="_blank"
              >
                <h6>{block.get('text')}</h6>
              </a>
            );
        default:
          return !block.get('url') ? <p>{block.get('text')}</p>
            : (
              <a
                className="url"
                href={block.get('url')}
                rel="noopener noreferrer"
                target="_blank"
              >
                <p>{block.get('text')}</p>
              </a>
            );
      }
    })()}
  </div>
);

HeadingBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
  className: PropTypes.string,
};

HeadingBlockPreview.defaultProps = {
  className: '',
};

export default HeadingBlockPreview;
