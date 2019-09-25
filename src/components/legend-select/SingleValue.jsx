import React from 'react';
import PropTypes from 'prop-types';

const SelectValue = ({ data }) => (
  <div className={`select__value status-${data.value}`} title={data.label}>
    <span className="select__value-label">
      {data.label}
    </span>
  </div>
);

SelectValue.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
};

export default SelectValue;
