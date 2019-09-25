import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';

const PageBreakBlockPreview = ({ className, block }) => (
  <div className={classNames('px-4', className)} role="presentation">
    <strong>Read More Text:</strong> {block.get('read_more_text')}
  </div>
);

PageBreakBlockPreview.propTypes = {
  className: PropTypes.string,
  block: PropTypes.instanceOf(Message).isRequired,
};

PageBreakBlockPreview.defaultProps = {
  className: '',
};

export default PageBreakBlockPreview;
