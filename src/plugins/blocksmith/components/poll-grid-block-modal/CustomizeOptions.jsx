import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Checkbox,
  FormGroup,
  UncontrolledTooltip,
  Icon,
} from '@triniti/admin-ui-plugin/components';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';

const CustomizeOptions = ({
  hasUpdatedDate,
  onChangeDate: handleChangeDate,
  onChangeHasUpdatedDAte: handleChangeHasUpdatedDate,
  onChangeAside: handleChangeAside,
  onChangeTime: handleChangeTime,
  updatedDate,
  aside,
}) => (
  <div className="modal-body-blocksmith">
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup className="mr-4">
        <Checkbox size="sd" checked={hasUpdatedDate} onChange={handleChangeHasUpdatedDate}>
          Is update
        </Checkbox>
        <Checkbox size="sd" checked={aside} onChange={handleChangeAside} className="ml-3">
          Aside
        </Checkbox>
        <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" style={{ marginLeft: '0.3rem' }} />
        <UncontrolledTooltip key="tooltip" placement="bottom" target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
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
  onChangeAside: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  updatedDate: PropTypes.instanceOf(moment).isRequired,
  aside: PropTypes.bool.isRequired,
};

export default CustomizeOptions;
