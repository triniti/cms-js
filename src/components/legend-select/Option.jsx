import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Option = ({ data, getValue, isSelected, setValue }) => {
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const value = getValue();
    if (value[0] && value[0].value === data.value) {
      setValue(null);
    } else {
      setValue({
        label: data.label,
        value: data.value,
      });
    }
  };
  return (
    <div
      className={classNames('select__option', { 'is-selected': isSelected })}
      onMouseDown={handleMouseDown}
      role="button"
      tabIndex="-1"
      title={data.label}
    >
      <span className={`select__status status-${data.value}`}>{data.label}</span>
    </div>
  );
};

Option.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  getValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default Option;
