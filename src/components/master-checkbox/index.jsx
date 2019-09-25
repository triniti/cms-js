import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  FormGroup,
} from '@triniti/admin-ui-plugin/components';

const MasterCheckbox = ({
  onChange,
  isSelected,
  checkAllLabel,
  uncheckAllLabel,
}) => (
  <div className="d-flex">
    <FormGroup check inline className="mr-0">
      <Checkbox
        id="master-checkbox"
        size="sm"
        onChange={onChange}
        checked={isSelected}
      >
        { !isSelected ? checkAllLabel : uncheckAllLabel }
      </Checkbox>
    </FormGroup>
  </div>
);

MasterCheckbox.propTypes = {
  checkAllLabel: PropTypes.string,
  onChange: PropTypes.func,
  isSelected: PropTypes.bool,
  uncheckAllLabel: PropTypes.string,
};

MasterCheckbox.defaultProps = {
  checkAllLabel: 'check all',
  isSelected: false,
  onChange: (e) => e.preventDefault(),
  uncheckAllLabel: 'uncheck all',
};

export default MasterCheckbox;
