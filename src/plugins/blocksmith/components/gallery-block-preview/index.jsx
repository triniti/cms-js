import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { Icon } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import delegate from './delegate';
import selector from './selector';
import './styles.scss';

export class GalleryBlockPreview extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    className: PropTypes.string,
    galleryNode: PropTypes.instanceOf(Message).isRequired,
    handleGetNode: PropTypes.func.isRequired,
    imageNode: PropTypes.instanceOf(Message),
  };

  static defaultProps = {
    className: '',
    imageNode: null,
  };

  componentDidMount() {
    const { handleGetNode, galleryNode, imageNode, block } = this.props;
    if (!imageNode && (block.has('poster_image_ref') || galleryNode.has('image_ref'))) {
      handleGetNode(block.get('poster_image_ref') || galleryNode.get('image_ref'));
    }
  }

  render() {
    const {
      block,
      className,
      galleryNode,
      imageNode,
    } = this.props;

    const imgSrc = imageNode ? `${damUrl(imageNode, 'o', 'md')}` : '';
    return (
      <div
        className={classNames('block-preview-gallery', className)}
        role="presentation"
      >
        <a
          href="https://www.google.com" // fixme: update this to work when we have a site to go to
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={imgSrc} alt="thumbnail" />
          {
            (block.has('launch_text') || galleryNode.has('launch_text'))
            && (
              <div className="launch-text">
                <p>{block.get('launch_text') || galleryNode.get('launch_text')}</p>
                <Icon alert border imgSrc="gallery" size="xs" alt="gallery-icon" />
              </div>
            )
          }
        </a>
      </div>
    );
  }
}

export default connect(selector, delegate)(GalleryBlockPreview);
