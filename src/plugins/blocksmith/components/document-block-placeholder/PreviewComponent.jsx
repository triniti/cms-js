import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { BackgroundImage, Media } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import selector from './selector';

const PreviewComponent = ({ image, onToggleImagePreviewSrc: handleToggleImagePreviewSrc }) => {
  const previewImage = !image ? null : (
    <Media
      aspectRatio="1by1"
      className="mt-2 ml-1 block-placeholder-thumbnail"
      onClick={() => handleToggleImagePreviewSrc(damUrl(image, '4by3', 'md'))}
    >
      <BackgroundImage
        imgSrc={damUrl(image, '1by1', 'xxs')}
        alt="Document Block Thumbnail"
      />
    </Media>
  );

  return previewImage;
}

PreviewComponent.propTypes = {
  image: PropTypes.instanceOf(Message).isRequired,
  onToggleImagePreviewSrc: PropTypes.func.isRequired,
};

export default connect(selector)(PreviewComponent);
