import PropTypes from 'prop-types';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import {
  Checkbox,
  FormGroup,
  Icon,
} from '@triniti/admin-ui-plugin/components';

const CustomizeOptions = ({
  aside,
  onChangeCheckBox: handleChangeCheckbox,
}) => (
  <div className="modal-body-blocksmith">
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup className="mr-4">
        <Checkbox size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox} className="ml-3">
          Aside
        </Checkbox>
        <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
        <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
      </FormGroup>
    </FormGroup>
  </div>
);

CustomizeOptions.propTypes = {
  aside: PropTypes.bool.isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  onChangeCheckBox: PropTypes.func.isRequired,
};

export default CustomizeOptions;
