import classNames from 'classnames';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import React from 'react';
import './styles.scss';

const DividerBlockPreview = ({ className, block }) => (
  <div className="px-4 pb-3">
    <div
      role="presentation"
      className={classNames('divider__preview', block.get('stroke_color'), className)}
      style={{ borderTopStyle: block.get('stroke_style') }}
    >
      <h5>{block.get('text')}</h5>
    </div>
  </div>
);

DividerBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
  className: PropTypes.string,
};

DividerBlockPreview.defaultProps = {
  className: '',
};

export default DividerBlockPreview;
