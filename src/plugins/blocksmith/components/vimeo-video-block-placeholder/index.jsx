import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import PreviewComponent from './PreviewComponent';

const VimeoVideoBlockPlaceholder = (props) => {
  const { block } = props;
  const userName = block.getData().get('canvasBlock').get('user_name');
  const config = {
    icon: {
      imgSrc: 'video',
    },
    label: `Vimeo Video Block${userName ? ` from ${userName}` : ''}`,
    preview: {
      component: PreviewComponent,
    },
  };

  return <GenericBlockPlaceholder config={config} {...props} />;
};

VimeoVideoBlockPlaceholder.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default VimeoVideoBlockPlaceholder;
