import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

const CustomOption = ({ innerProps, data, selectProps, isSelected }) => (
  <div {...innerProps} className="divider__color divider__option">
    <div className={classNames('select__option', { 'is-selected': isSelected })}>
      <div className="divider__option-label">{data.label}</div>
      <div
        className={`${selectProps.strokeColor || data.value} divider__bar`}
        style={{ borderTopStyle: selectProps.strokeStyle || data.value }}
      />
    </div>
  </div>
);

CustomOption.propTypes = {
  innerProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  selectProps: PropTypes.shape({
    strokeColor: PropTypes.string,
    strokeStyle: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
};

CustomOption.defaultProps = {
  isSelected: false,
};

export default CustomOption;
