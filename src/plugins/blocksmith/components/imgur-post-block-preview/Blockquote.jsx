import React from 'react';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';

const ImgurPostBlockEmbed = (props) => {
  const { block } = props;

  return (
    <blockquote
      className="imgur-embed-pub"
      lang="en"
      data-id={block.has('id') ? block.get('id') : ''}
      data-context={block.has('show_context') ? block.get('show_context').toString() : ''}
    />
  );
};

ImgurPostBlockEmbed.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default ImgurPostBlockEmbed;
