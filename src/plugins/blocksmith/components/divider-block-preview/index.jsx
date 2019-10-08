import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';

const DividerBlockPreview = ({ className, block }) => (
  <div className={classNames('divider-preview', 'px-4', className)} role="presentation" style={{ display: 'flex' }}>
    <h3 style={{ color: block.get('stroke_color') }}>{block.get('text')}</h3>
    <div
      className="bar"
      style={{
        height: '6px',
        width: '300px',
        margin: '10px 0px 10px 6px',
        borderTop: `5px ${block.get('stroke_style') || 'solid'} ${block.get('stroke_color') || 'black'}` }}
    />
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
