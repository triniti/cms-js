import classNames from 'classnames';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import React from 'react';
import './styles.scss';

const DividerBlockPreview = ({ className, block }) => (
  <div role="presentation" className={classNames('divider-preview', 'px-4', block.get('stroke_color'), className)}>
    <h3>{block.get('text')}</h3>
    <div className="divider__bar" style={{ borderTopStyle: block.get('stroke_style') }} />
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
