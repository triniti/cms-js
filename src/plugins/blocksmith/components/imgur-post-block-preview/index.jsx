import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const ImgurPostBlockPreview = (props) => {
  const { block } = props;

  return (
    <iframe
      title="Imgur Post Block"
      allowFullScreen
      className={`imgur-embed-iframe-pub imgur-embed-iframe-pub-${block.get('id')}-true-500`}
      scrolling="no"
      src={`https://imgur.com/${block.get('id')}/embed?pub=true&context=${block.get('show_context')}&analytics=false`}
      id={`imgur-embed-iframe-pub-${block.get('id')}`}
      style={{ height: '600px', width: '500px', margin: '20px 0px', padding: '0px', border: '1px solid #ddd' }}
    />
  );
};

ImgurPostBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default ImgurPostBlockPreview;
