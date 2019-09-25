import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import InstagramEmbed from 'react-instagram-embed';

const InstagramMediaBlockPreview = ({ block }) => (
  <InstagramEmbed
    url={`https://instagr.am/p/${block.get('id')}/`}
    hideCaption={block.get('hidecaption') || false}
  />
);

InstagramMediaBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default InstagramMediaBlockPreview;
