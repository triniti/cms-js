import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';

const FacebookPostBlockPlaceholder = (props) => {
  const { block } = props;
  const getUserName = block.getData().get('canvasBlock').get('href').split('/')[3];
  const fromUserName = getUserName.indexOf('photo.php') === -1 ? `from ${getUserName}` : '';
  const config = {
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'pencil',
        },
        secondary: {
          imgSrc: 'facebook',
        },
      },
    },
    label: `Facebook Post Block ${fromUserName}`,
  };

  return <GenericBlockPlaceholder config={config} {...props} />;
};

FacebookPostBlockPlaceholder.propType = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default FacebookPostBlockPlaceholder;
