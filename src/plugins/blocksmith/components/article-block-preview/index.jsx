import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { Icon } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import selector from './selector';
import './styles.scss';

const ArticleBlockPreview = ({ className, articleNode, imageNode, block }) => {
  const imgSrc = imageNode ? damUrl(imageNode, 'o', 'md') : null;
  return (
    <div
      className={classNames('block-preview-article', className)}
      role="presentation"
    >
      <a
        href="https://www.google.com" // fixme: update this to work when we have a site to go to
        rel="noopener noreferrer"
        target="_blank"
      >
        {
          block.get('show_image') ? (
            <div className="image-wrapper">
              {
                imgSrc
                && <img src={imgSrc} alt="thumbnail" />
              }
              <div className="launch-text">
                <p>{block.get('link_text') || articleNode.get('title')}</p>
                <Icon alert border imgSrc="book-open" size="xs" alt="article-icon" />
              </div>
            </div>
          ) : (
            block.get('link_text') || articleNode.get('title')
          )
        }
      </a>
    </div>
  );
};

ArticleBlockPreview.propTypes = {
  articleNode: PropTypes.instanceOf(Message).isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
  className: PropTypes.string,
  imageNode: PropTypes.instanceOf(Message),
};

ArticleBlockPreview.defaultProps = {
  className: '',
  imageNode: null,
};

export default connect(selector)(ArticleBlockPreview);
