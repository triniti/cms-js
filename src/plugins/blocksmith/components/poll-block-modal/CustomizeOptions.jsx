import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import Message from '@gdbots/pbj/Message';
import PollBlockPreview from '@triniti/cms/plugins/blocksmith/components/poll-block-preview';
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
  block,
  hasUpdatedDate,
  onChangeCheckBox: handleChangeCheckbox,
  onChangeDate: handleChangeDate,
  onChangeTime: handleChangeTime,
  updatedDate,
}) => (
  <div className="modal-body-blocksmith">
    <PollBlockPreview block={block} />
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup className="mr-4">
        <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={handleChangeCheckbox}>
          Is update
        </Checkbox>
        <Checkbox size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox} className="ml-3">
          Aside
        </Checkbox>
        <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
        <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
      </FormGroup>
    </FormGroup>
    {hasUpdatedDate
    && (
      <DateTimePicker
        onChangeDate={handleChangeDate}
        onChangeTime={handleChangeTime}
        updatedDate={updatedDate}
      />
    )}
  </div>
);

CustomizeOptions.propTypes = {
  aside: PropTypes.bool.isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  onChangeCheckBox: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  updatedDate: PropTypes.instanceOf(Date).isRequired,
};

export default CustomizeOptions;
