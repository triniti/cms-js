import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';

const DividerBlockPreview = ({ className, block }) => (
  <div className={classNames('divider-preview', 'px-4', block.get('stroke_color'), className)} role="presentation" style={{ display: 'flex' }}>
    <h3>{block.get('text')}</h3>
    <div
      className="divider__bar"
      style={{
        height: '6px',
        width: '300px',
        margin: '12px 0px 10px 6px',
        borderTopStyle: block.get('stroke_style') || 'solid',
      }}
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
