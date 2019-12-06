import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import ImgurEmbed from 'react-imgur-embed';

const InstagramMediaBlockPreview = ({ block }) => (
  <ImgurEmbed id={block.get('id')} />
);

InstagramMediaBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default InstagramMediaBlockPreview;
