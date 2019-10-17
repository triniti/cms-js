import classNames from 'classnames';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

const CustomOption = ({ innerProps, data, selectProps, isSelected }) => (
  <div {...innerProps} className="divider__color">
    <div className={classNames('select__option', { 'is-selected': isSelected })}>{data.label}</div>
    <div
      role="presentation"
      className={data.value}
      style={{ borderTopStyle: selectProps.block.get('stroke_style') }}
    />
  </div>
);

CustomOption.propTypes = {
  innerProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  selectProps: PropTypes.shape({
    block: PropTypes.instanceOf(Message).isRequired,
  }).isRequired,
  isSelected: PropTypes.bool,
};

CustomOption.defaultProps = {
  isSelected: false,
};

export default CustomOption;
