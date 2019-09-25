import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { BackgroundImage, Media } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import delegate from './delegate';
import selector from './selector';

class PreviewComponent extends React.Component {
  static propTypes = {
    handleGetNode: PropTypes.func.isRequired,
    image: PropTypes.instanceOf(Message),
    imageRef: PropTypes.instanceOf(NodeRef),
    onToggleImagePreviewSrc: PropTypes.func.isRequired,
  };

  static defaultProps = {
    image: null,
    imageRef: null,
  };

  componentDidMount() {
    const { handleGetNode, image, imageRef } = this.props;
    if (!image && imageRef) {
      handleGetNode(imageRef);
    }
  }

  render() {
    const { image, onToggleImagePreviewSrc: handleToggleImagePreviewSrc } = this.props;
    return !image ? null : (
      <Media
        aspectRatio="1by1"
        className="mt-2 ml-1 block-placeholder-thumbnail"
        onClick={() => handleToggleImagePreviewSrc(damUrl(image))}
      >
        <BackgroundImage
          imgSrc={image ? damUrl(image) : ''}
          alt="Poll Block Thumbnail"
        />
      </Media>
    );
  }
}

export default connect(selector, delegate)(PreviewComponent);
