import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';

const TwitterTweetBlockPlaceholder = (props) => {
  const { block } = props;
  const config = {
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'tweet',
        },
        secondary: {
          imgSrc: 'twitter',
        },
      },
    },
    label: `Twitter Tweet Block from @${block.getData().get('canvasBlock').get('screen_name')}`,
  };

  return <GenericBlockPlaceholder config={config} {...props} />;
};

TwitterTweetBlockPlaceholder.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default TwitterTweetBlockPlaceholder;
