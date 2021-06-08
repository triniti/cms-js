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
    handleGetImageNode: PropTypes.func.isRequired,
    image: PropTypes.instanceOf(Message),
    imageRef: PropTypes.instanceOf(NodeRef),
    onToggleImagePreviewSrc: PropTypes.func.isRequired,
  };

  static defaultProps = {
    image: null,
    imageRef: null,
  };

  componentDidMount() {
    const { handleGetImageNode, image, imageRef } = this.props;
    if (!image && imageRef) {
      handleGetImageNode(imageRef);
    }
  }

  render() {
    const { image, onToggleImagePreviewSrc: handleToggleImagePreviewSrc } = this.props;
    return !image ? null : (
      <Media
        aspectRatio="1by1"
        className="ml-1 block-placeholder-thumbnail"
        onClick={() => handleToggleImagePreviewSrc(damUrl(image, '4by3', 'md'))}
      >
        <BackgroundImage
          imgSrc={image ? damUrl(image, '1by1') : 'xxs'}
          alt="Youtube Playlist Block Thumbnail"
        />
      </Media>
    );
  }
}

export default connect(selector, delegate)(PreviewComponent);
