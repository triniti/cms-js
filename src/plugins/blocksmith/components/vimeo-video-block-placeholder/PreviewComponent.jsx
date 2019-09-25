import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { BackgroundImage, Media } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import selector from './selector';

const PreviewComponent = ({
  image,
  onToggleImagePreviewSrc: handleToggleImagePreviewSrc,
}) => (!image ? null : (
  <Media
    aspectRatio="1by1"
    className="ml-1 block-placeholder-thumbnail"
    onClick={() => handleToggleImagePreviewSrc(damUrl(image, '4by3', 'md'))}
  >
    <BackgroundImage
      imgSrc={image ? damUrl(image, '1by1', 'xxs') : ''}
      alt="Vimeo Video Block Thumbnail"
    />
  </Media>
));

PreviewComponent.propTypes = {
  image: PropTypes.instanceOf(Message),
  onToggleImagePreviewSrc: PropTypes.func.isRequired,
};

PreviewComponent.defaultProps = {
  image: null,
};

export default connect(selector)(PreviewComponent);
