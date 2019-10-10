import classNames from 'classnames';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

const CustomOption = ({ innerProps, data, selectProps, isSelected }) => (
  <div {...innerProps}>
    <div className={classNames('select__option', { 'is-selected': isSelected })}>{data.label}</div>
    <div
      role="presentation"
      style={{ borderTopStyle: selectProps.block.get('stroke_style'), borderTopColor: data.value }}
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
