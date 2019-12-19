import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const TikTokBlockPreview = ({ block }) => (
  <div style={{ textAlign: 'center' }}>
    <iframe
      title="TikTok Block Embed"
      width="340"
      height="700"
      src={`https://www.tiktok.com/embed/${block.get('tiktok_id')}`}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

TikTokBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default TikTokBlockPreview;
