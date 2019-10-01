import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Checkbox,
  FormGroup,
} from '@triniti/admin-ui-plugin/components';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';

const CustomizeOptions = ({
  hasUpdatedDate,
  onChangeDate: handleChangeDate,
  onChangeHasUpdatedDAte: handleChangeHasUpdatedDate,
  onChangeTime: handleChangeTime,
  updatedDate,
}) => (
  <div className="modal-body-blocksmith">
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup className="mr-4">
        <Checkbox size="sd" checked={hasUpdatedDate} onChange={handleChangeHasUpdatedDate}>
          Is update
        </Checkbox>
      </FormGroup>
    </FormGroup>
    {
      hasUpdatedDate
      && (
        <DateTimePicker
          onChangeDate={handleChangeDate}
          onChangeTime={handleChangeTime}
          updatedDate={updatedDate}
        />
      )
    }
  </div>
);

CustomizeOptions.propTypes = {
  hasUpdatedDate: PropTypes.bool.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeHasUpdatedDAte: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  updatedDate: PropTypes.instanceOf(moment).isRequired,
};

export default CustomizeOptions;
