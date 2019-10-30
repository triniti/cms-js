import PropTypes from 'prop-types';
import React from 'react';
import { Select } from '@triniti/admin-ui-plugin/components';
import Option from './Option';
import SingleValue from './SingleValue';

const LegendSelect = ({
  name,
  onChange,
  options,
  placeholder,
  value,
}) => (
  <Select
    className="select--status"
    components={{
      Option: ({ children, data, ...rest }) => (
        <Option
          data={data}
          isSelected={value && data.value === value.value}
          {...rest}
        >
          {children}
        </Option>
      ),
      SingleValue,
    }}
    isClearable
    name={name}
    onChange={onChange}
    options={options}
    placeholder={placeholder}
    styles={{
      control: () => ({ minWidth: '9rem', backgroundColor: 'white' }),
    }}
    value={value}
  />
);

LegendSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  })).isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
};

LegendSelect.defaultProps = {
  placeholder: 'Select:',
  value: null,
};


export default LegendSelect;
